import { UserAddress } from "@ts-types/custom.types";

function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {}
    );
}

export function formatAddress(address: UserAddress) {
  let formattedAddress = {};
  if (address) {
    formattedAddress = removeEmpty(address);
  } 
  return Object.values(formattedAddress).slice(1,3).join(", ")+', '+Object.values(formattedAddress).slice(-3).join(", ");
}
