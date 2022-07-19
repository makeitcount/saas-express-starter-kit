/**
 * Common DOM operations wrapped in a nice accessible object named "DOM"
 */


const DOM = {
    /**
     * Helper functions to manage loader
     * @returns {Object<show: Function, hide: Function>} object containing functions to manage loaders
     */
    loader : function(){
        return {
                /**
                 * Show loader with a message
                 * @param {String} message 
                 */
                show: function (message) {
                let loaderNode = document.createElement("div");
                loaderNode.setAttribute("id", "_loader");
                loaderNode.classList.add("_loader");
                let loadingText = document.createTextNode(message);
                loaderNode.appendChild(loadingText);
                document.body.appendChild(loaderNode);
            },
                /**
                 * Hide loader
                 */
                hide: function () {
                let loader = document.getElementById("_loader");
                loader.remove();
            }
        }
    },
    /**
     * Extract all the fields of a form with values
     * @param {String} formElementId the form we want to operate on 
     * @returns {{id: String, value: String}[]} Returns formFields i.e. form input fields with values e.g. [{id: "email", value: "example@somesite.com"}] 
     */
    getFormFields: function getFormFields(formElementId, options){
        var inputs = document.getElementById(formElementId).elements;
        // Make sure the form has some inputs
        if (!inputs || inputs.length < 1) {
          alert(
            "Invalid form"
          );
          return null;
        }
        // Add all input values in an array with {id: inputName, value: inputValue} format
        let formFields = [];
        for (let i = 0; i < inputs.length; i++) {
          let formInputElement = inputs[i];
          if (!formInputElement || !formInputElement.name || !formInputElement.value) continue;
          if(options && options.fields && options.fields.indexOf(formInputElement.name)==-1) continue;
          formFields.push({
            id: formInputElement.name,
            value: formInputElement.value
          });
        }
        return formFields;
    },

}