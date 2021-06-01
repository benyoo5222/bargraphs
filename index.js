const defaultOptions = {
  width: "500px",
  height: "500px",
};

const createAPIResponses = (statusCode, message) => {
  return {
    statusCode,
    message,
  };
};

const checkIfBarInfoValid = (currentValue) => {
  return currentValue.value
    ? !Number.isNaN(Number(currentValue.value))
    : !Number.isNaN(Number(currentValue));
};

const createBarDivs = (barInfo, barGraphContinaerConfig) => {
  const fullCopyOfBarInfo = JSON.parse(JSON.stringify(barInfo.arrayOfInfo));
  const largestNumber = fullCopyOfBarInfo.sort((a, b) => {
    if (barInfo.isArrayOfObjects) {
      return b.value - a.value;
    }

    return b - a;
  })[0];
};

const drawBarChart = (data, options, element) => {
  // Data represents the bars information and values - Array of information
  // options represent the entire bar graph ex: title, width & height of the whole container, etc
  // element

  return new Promise(resolve, (reject) => {
    const selectedElement = document.querySelector(element);

    if (selectedElement === null) {
      // TO DO: Build lib folder for API responses
      reject(createAPIResponses(400, `${element} element does not exist`));
    }

    if (!Array.isArray(data) || data.length === 0) {
      reject(
        createAPIResponses(400, "Please provide an array of bar information")
      );
    }

    if (!data.every(checkIfBarInfoValid)) {
      reject(
        createAPIResponses(400, "Please make sure your bar data is valid")
      );
    }

    const barInfo = {
      barGraphContinaerConfig: {
        ...defaultOptions,
        ...options,
      },
    };
  });
};
