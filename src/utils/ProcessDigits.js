const ProcessDigits = (digit) => {
  return (Math.round(digit * 100) / 100).toFixed(2);
};

export default ProcessDigits;
