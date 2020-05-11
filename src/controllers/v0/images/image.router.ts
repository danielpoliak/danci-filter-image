// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
import { Router, Request, Response } from 'express';
import { requireAuth } from '../users/authorization';
import {deleteLocalFiles, filterImageFromURL} from "../../../util/util";

const router: Router = Router();

router.get( "/filteredimage/",
    requireAuth,
    async (req:Request, res:Response ) => {
    const {image_url} = req.query

    if (!image_url) {
        return res.status(400).send({ message: 'image_url query parameter is required' });
    }

    try {
        const filteredpath = await filterImageFromURL(image_url)

        res.status(200).sendFile(filteredpath, async (err) => {
            if(err) {
                res.status(500)
            } else {
                await deleteLocalFiles([filteredpath])
            }
        })
    } catch(err) {
        return res.status(422).send({ message: `Server was not able to process the image at url: ${image_url}` });
    }
} );

export const ImageRouter: Router = router