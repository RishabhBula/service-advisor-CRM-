export const getSumOfArray = arr => {
  return arr.length ? arr.reduce((total, num) => total + num) : 0;
};

/**
 *
 */
export const calculateValues = (total, value, type = "%") => {
  switch (type) {
    case "%":
      return (total * value) / 100;
    case "$":
      return value;
    default:
      return value;
  }
};
/** 
/* 
 */
export const calculateSubTotal = (cost, quantity, hour, rate) => {
  return (parseFloat(cost || hour) * parseFloat(quantity || rate))
}
/** 
/* 
 */
export const calculateDurationFromSeconds = (Seconds) => {
  var minutes = Math.floor(Seconds / 60);
  Seconds = Seconds % 60;
  var hours = Math.floor(minutes / 60)
  minutes = minutes % 60;
  const duration = `${hours}:${minutes}:${Seconds}`
  return duration
}
/** 
/* 
 */
export const serviceTotalsCalculation = (serviceData) => {
  let totalParts = 0, totalTires = 0, totalLabor = 0, orderSubTotal = 0, orderGandTotal = 0, serviceTotalArray,
    totalTax = 0, totalDiscount = 0;
  if (serviceData && serviceData.length) {
    serviceData.map((item, index) => {
      let mainserviceTotal = [], serviceTotal, epa, discount, tax
      item.serviceId.serviceItems.map((service, sIndex) => {
        const calSubTotal = calculateSubTotal(service.cost || (service.tierSize ? service.tierSize[0].cost : null) || 0, service.qty || 0, service.hours || 0, (service.rate ? service.rate.hourlyRate : 0)).toFixed(2)
        const subDiscount = calculateValues(calSubTotal || 0, service.discount.value || 0, service.discount.type);
        const servicesSubTotal = (parseFloat(calSubTotal) - parseFloat(subDiscount)).toFixed(2);
        mainserviceTotal.push(parseFloat(servicesSubTotal))
        serviceTotalArray = getSumOfArray(mainserviceTotal)
        epa = calculateValues(serviceTotalArray || 0, item.serviceId.epa.value || 0, item.serviceId.epa ? item.serviceId.epa.type : '$');
        discount = calculateValues(serviceTotalArray || 0, item.serviceId.discount.value || 0, item.serviceId.discount ? item.serviceId.discount.type : '$');
        tax = calculateValues(serviceTotalArray || 0, item.serviceId.taxes.value || 0, item.serviceId.taxes ? item.serviceId.taxes.type : '$');
        serviceTotal = (parseFloat(serviceTotalArray) + parseFloat(epa) + parseFloat(tax) - parseFloat(discount)).toFixed(2);
        if (service.serviceType === 'part') {
          totalParts += parseFloat(servicesSubTotal)
        }
        if (service.serviceType === 'tire') {
          totalTires += parseFloat(servicesSubTotal)
        }
        if (service.serviceType === 'labor') {
          totalLabor += parseFloat(servicesSubTotal)
        }
        orderSubTotal += (parseFloat(servicesSubTotal))
        return true
      })
      totalTax += parseFloat(epa) + parseFloat(tax)
      totalDiscount += parseFloat(discount)
      orderGandTotal += parseFloat(serviceTotal)
      return true
    })
  }
  const data = {
    totalParts,
    totalTires,
    totalLabor,
    orderSubTotal,
    totalTax,
    totalDiscount,
    orderGandTotal
  }
  return data
}