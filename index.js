const defaultOptions = {
  width: "500px",
  height: "500px",
  margin: "5px",
  defaultBarColor: "black",
};

const createAPIResponses = (statusCode, message) => {
  return {
    statusCode,
    message,
  };
};

const parsePixelsIntoNumber = (dimensions) => {
  return Number(dimensions.match(/[0-9]/g).join(""));
};

const checkBarInfoObjIsValid = (currentObj) => {
  return currentObj.value;
};

const isBarDataAnArrayOfObjects = (currentValue) => {
  return currentValue.arrayOfBarGroupInfo
    ? currentValue.arrayOfBarGroupInfo.length > 0
      ? currentValue.arrayOfBarGroupInfo.every(checkBarInfoObjIsValid)
      : false
    : false;
};

const checkIfBarInfoValid = (currentValue) => {
  return currentValue.arrayOfBarGroupInfo
    ? currentValue.arrayOfBarGroupInfo.length > 0
      ? currentValue.arrayOfBarGroupInfo.every(checkBarInfoObjIsValid)
      : false
    : !Number.isNaN(Number(currentValue));
};

const calculateNestedObjLargestValue = (arrayOfInfo) => {
  const barInfoTracker = {};
  for (let barGroupInfo of arrayOfInfo) {
    barGroupInfo.arrayOfBarGroupInfo.forEach((infoObj) => {
      barInfoTracker.largestNumber &&
      barInfoTracker.largestNumber > infoObj.value
        ? null
        : (barInfoTracker.largestNumber = infoObj.value);
    });
  }

  return barInfoTracker.largestNumber;
};

const createBarDivs = (barInfo) => {
  const fullCopyOfBarInfo = JSON.parse(JSON.stringify(barInfo.arrayOfInfo));
  const largestDataPoint = barInfo.isBarDataAnArrayOfObjects
    ? calculateNestedObjLargestValue(barInfo.arrayOfInfo)
    : fullCopyOfBarInfo.sort((a, b) => {
        return b - a;
      })[0];
  console.log("largest data", largestDataPoint);

  const averageWidthOfPixelsPerGroup = Math.round(
    parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.width) /
      largestDataPoint
  );

  const averageHeightOfPixelsPerGroup =
    Math.round(
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.height) /
        barInfo.arrayOfInfo.length
    ) -
    barInfo.arrayOfInfo.length *
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.margin);

  const divBarContinerElement = document.createElement("div");

  divBarContinerElement.style.width = barInfo.barGraphContinaerConfig.width;
  divBarContinerElement.style.height = barInfo.barGraphContinaerConfig.height;

  barInfo.arrayOfInfo.forEach((info, index) => {
    const divElement = document.createElement("div");
    divElement.style.margin = barInfo.barGraphContinaerConfig.margin;

    if (barInfo.isBarDataAnArrayOfObjects) {
      info.arrayOfBarGroupInfo.forEach((infoObj) => {
        const innerBarDiv = document.createElement("div");
        innerBarDiv.style.width = `${Math.floor(
          averageWidthOfPixelsPerGroup * infoObj.value
        )}px`;
        innerBarDiv.style.height = `${Math.floor(
          averageHeightOfPixelsPerGroup / info.arrayOfBarGroupInfo.length
        )}px`;

        innerBarDiv.style.backgroundColor =
          infoObj.barColor || barInfo.barGraphContinaerConfig.defaultBarColor;

        divElement.appendChild(innerBarDiv);
        divBarContinerElement.appendChild(divElement);
      });
      return;
    }

    divElement.style.backgroundColor = barInfo.barGraphContinaerConfig.barColors
      ? barInfo.barGraphContinaerConfig.barColors[index]
      : barInfo.barGraphContinaerConfig.defaultBarColor; // Will change based on config
    divElement.style.width = `${
      averageWidthOfPixelsPerGroup * info -
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.margin)
    }px`;
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

    if (!data.every(checkIfBarInfoValid)) {
      reject(
        createAPIResponses(400, "Please make sure your bar data is valid")
      );
    }

    // To Do: create Validation module for options object
    // To Do: create Validation for bar color length IF not nestedObjects

    const barInfo = {
      barGraphContinaerConfig: {
        ...defaultOptions,
        ...options,
      },
      arrayOfInfo: data,
      isBarDataAnArrayOfObjects: data.every(isBarDataAnArrayOfObjects),
    };
    selectedElement.appendChild(createBarDivs(barInfo));

    resolve(createAPIResponses(200, "Sucessfully created Bar Graph"));
  });
};

drawBarChart(
  [
    {
      arrayOfBarGroupInfo: [
        { barColor: "grey", value: 16 },
        { barColor: "orange", value: 10 },
        { barColor: "pink", value: 10 },
      ],
    },
    {
      arrayOfBarGroupInfo: [
        { barColor: "red", value: 35 },
        { barColor: "blue", value: 22 },
      ],
    },
  ],
  { barColors: ["red", "pink", "blue", "orange", "black"] },
  "#root"
);
