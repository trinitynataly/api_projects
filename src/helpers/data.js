/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 14/05/2023

Helper functions for data manipulation
*/

// Helper function to extract fields from an object and return a new object with only the extracted fields
const extractFields = (obj, fields, defaultValue = null) => {
        // Return the fields extracted from the object
    return fields.reduce((acc, field) => {

        // Check if the object has the field
        if (obj.hasOwnProperty(field)) {
            // if yes, add the field to the accumulator object
            acc[field] = obj[field];
        } else {
            // if no, add the field to the accumulator object with the default value it is not null
            if (defaultValue !== null) {
                acc[field] = defaultValue;
            }
        }
        // Return the accumulator object
        return acc;
    }, {});
}

module.exports = {extractFields};
