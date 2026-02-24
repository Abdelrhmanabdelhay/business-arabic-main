
// create random payment number by userid and service id
const createPaymentNumber = (userId: string, serviceId: string) => {
  return `PAY-${userId}-${serviceId}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export default createPaymentNumber;