import { priceFormat } from "@/utils/";
export const formatList = (list, price) => {
  return list.map((item) => {
    const pay_rate_price = Math.floor(price * item.pay_rate * 100) / 100;
    const claim_rate_price = Math.floor(price * item.claim_rate * 100) / 100;
    let desc = "";
    if (item?.insurance_desc_concat) {
      desc = item.insurance_desc_concat
        .replace(/\${claimAmount}/, `¥${priceFormat(claim_rate_price, 2)}`)
        .replace(/\${payAmount}/, `¥${priceFormat(pay_rate_price, 2)}`);
    }
    return {
      name: item.insurance_name,
      price: pay_rate_price,
      claim_price: claim_rate_price,
      pay_rate: item.pay_rate,
      claim_rate: item.claim_rate,
      insurance_instructions: item?.insurance_instructions_concat,
      desc: desc,
      id: item.id,
      insurance_type: item.insurance_type,
    };
  });
};
