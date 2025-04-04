import * as Location from "expo-location";
import { isNull } from "../utils";

export const useDisplayAddress = () => {
  const generateAddress = async ({ latitude, longitude }) => {
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    for (let item of response) {
      let address = ``;
      if (!isNull(item?.name)) address += `${item?.name}, `;
      if (!isNull(item?.district)) address += `${item?.district}, `;
      if (!isNull(item?.city)) address += `${item?.city}, `;
      if (!isNull(item?.region)) address += `${item?.region}, `;
      if (!isNull(item?.postalCode)) address += `${item?.postalCode}, `;
      if (!isNull(item?.country)) address += `${item?.country}`;

      return address;
    }
  };

  return {
    generateAddress,
  };
};
