// the below code is same as the following :
// import {v2} from 'cloudinary'
// const cloudinary = v2

// also same as the following :
// import cloudinary from 'cloudinary'
// const cloudinV2 = cloudinary.v2()

import { v2 as cloudinary } from 'cloudinary'

// config has 3 main attributes and one optional -> those 3 are the Product Environment Credentials on the cloudinary dashboard
// you must put them as strings :
cloudinary.config({
    api_key: '664347232433724',
    api_secret: 'SmZJm_nzzsOZC2Umj2l1NYDLe1Y',
    cloud_name: 'dgpah59w3'
})
// we now established the connection with the media host like we do with the database .
// we need to export this variable to access the uploading related methods

export default cloudinary
