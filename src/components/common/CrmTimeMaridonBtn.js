import React, { Component } from "react";
import {
    Button
} from "reactstrap";

class CrmTimeMaridonBtn extends Component {
    render() {
        return (
            <>
                <div className="discount-button">
                    <Button id={`AM`} size={"sm"} className={(this.props.timeType === 'AM') ? "btn btn-secondary btn-sm active dollar-btn" : 'btn btn-secondary btn-sm dollar-btn'} onClick={() => this.props.handleClickTimeType('AM')}>
                        <span className="dollar-price">AM</span>
                    </Button>
                    <Button id={`PM`} size={"sm"} className={(this.props.timeType === 'PM') ? "btn btn-secondary btn-sm sec-btn active flat-btn" : 'btn btn-secondary btn-sm sec-btn flat-btn'} onClick={() => this.props.handleClickTimeType('PM')}>
                        <span className="dollar-price">PM</span>
                    </Button>
                </div>
            </>
        )
    }
}
export default CrmTimeMaridonBtn;