import {getRandomNumber} from "../scripts/generic";

export default const InstanceMixin = {
    data: function () {
        return {
            _refID: getRandomNumber(1000000),
        }
    },
}
