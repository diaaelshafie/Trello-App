# notes

==========

## To take a date from the request and check if it exceeds today's date or not, you can follow these steps

1. Parse the date from the request body or query parameters.
2. Get the current date (today's date).
3. Compare the parsed date with today's date.

Here's an example of how to do this in a Mongoose controller function:

```javascript
import { StatusCodes } from 'http-status-codes';

export const checkDate = async (req, res, next) => {
  const { date } = req.body; // Assuming the date is in the request body

  if (!date) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Date is missing in the request body.'
    });
  }

  const parsedDate = new Date(date); // Parse the date from the request
  // the date format should be : 'yyyy-mm-dd'

  if (isNaN(parsedDate)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid date format.'
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set today's date to the beginning of the day (midnight)

  if (parsedDate > today) {
    return res.status(StatusCodes.OK).json({
      message: 'The provided date exceeds today.'
    });
  } else {
    return res.status(StatusCodes.OK).json({
      message: 'The provided date is on or before today.'
    });
  }
};
```

In this example, we first parse the date from the request using `new Date(date)`. If the date is not valid (e.g., not a valid date format), we return a 400 Bad Request response.

We then get today's date using `new Date()`, and set its hours, minutes, seconds, and milliseconds to zero to compare only the date part without the time. We then compare the parsed date with today's date. If the parsed date is greater than today, it means the provided date exceeds today's date, and we send a response indicating that. Otherwise, we send a response indicating that the provided date is on or before today.

- `v.imp note` : `_id` type is `object` .

- to delete a certain field (update the document techincally) in a doc , use $unset in findAndUpdate methods :

  ``` js
    const getUser = await userModel.findByIdAndUpdate(_id, { $unset: { profilePicture: 1 } }, { new: false })
  ```

- to make the same logic of .includes() to an array of object , we can do :

  ```js
      const checkPublicId = await coverPictures.some(key => key.public_id === public_id)
  ```

- to remove (execlude) a certain element of an array in a document and leave the document itself , use :

  ```js
      const updateUser = await userModel.updateOne({ _id }, { $pull: { coverPictures: { public_id } } })
  ```

- code to look at :

  ```js
      // public_id field in the request body is an array of strings (public_ids of photos)
    const { public_id } = req.body
    const photosIDs = []
    let flag = true
    for (let string in public_id) {
        if (coverPictures.some(key => key.public_id === public_id[string])) {
            photosIDs.push(public_id[string])
        }
        else {
            flag = false
        }
    }
  ```
