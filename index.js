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

const parseWidthOrHeightPixels = (dimensions) => {
  return dimensions.match(/[0-9]/g).join("");
};

const checkIfBarInfoValid = (currentValue) => {
  return currentValue.value
    ? !Number.isNaN(Number(currentValue.value))
    : !Number.isNaN(Number(currentValue));
};

const createBarDivs = (barInfo) => {
  const fullCopyOfBarInfo = JSON.parse(JSON.stringify(barInfo.arrayOfInfo));
  const largestDataPoint = fullCopyOfBarInfo.sort((a, b) => {
    if (barInfo.isArrayOfObjects) {
      return b.value - a.value;
    }

    return b - a;
  })[0];

  const averageWidthOfPixelsPerGroup = Math.round(
    parseWidthOrHeightPixels(barInfo.barGraphContinaerConfig.width) /
      largestDataPoint
  );
  const averageHeightOfPixelsPerGroup = Math.round(
    parseWidthOrHeightPixels(barInfo.barGraphContinaerConfig.height) /
      barInfo.arrayOfInfo.length
  );

  const divBarContinerElement = document.createElement("div");

  barInfo.arrayOfInfo.forEach((info) => {
    // To Do --> Check if array of objects
    const divElement = document.createElement("div");
    divElement.style.backgroundColor = "black"; // Will change based on config
    divElement.style.margin = "5px"; // Need to calculate Or be overwritten by the config
    divElement.style.width = `${averageHeightOfPixelsPerGroup * info}px`;
    divElement.style.height = `${averageHeightOfPixelsPerGroup}px`;

    divBarContinerElement.appendChild(divElement);
  });

  return divBarContinerElement;
};

const drawBarChart = (data, options, element) => {
  // Data represents the bars information and values - Array of information
  // options represent the entire bar graph ex: title, width & height of the whole container, etc
  // element

  return new Promise((resolve, reject) => {
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

    const isArrayOfObjects = data.every(checkIfBarInfoValid);

    if (!isArrayOfObjects) {
      reject(
        createAPIResponses(400, "Please make sure your bar data is valid")
      );
    }

    // To Do create Validation module for options object

    const barInfo = {
      barGraphContinaerConfig: {
        ...defaultOptions,
        ...options,
      },
      arrayOfInfo: data,
      isArrayOfObjects,
    };
    selectedElement.appendChild(createBarDivs(barInfo));
  });
};

drawBarChart([1, 2, 3, 4, 5], {}, "#root");
