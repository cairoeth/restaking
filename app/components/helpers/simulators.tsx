import { contracts } from "components/helpers/contracts"
import { faker } from '@faker-js/faker';

export function StakedAssetsSimulator() {
    var data: any = {}

    for (var i = 0; i < contracts.length; ++i) {
        data[contracts[i].address] = 0.4
    }
    
    return data
}
