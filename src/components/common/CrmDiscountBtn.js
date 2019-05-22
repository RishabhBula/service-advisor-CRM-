import React, { Component } from "react";
import {
    UncontrolledTooltip,
    Button
} from "reactstrap";

class CrmDiscountBtn extends Component {
    render() {
        return(
            <>
                 <div className="discount-button">
                    <Button id={"percent"} className={(this.props.discountType==='%') ? "btn btn-secondary btn-sm active" :'btn btn-secondary btn-sm'} onClick={()=>this.props.handleClickDiscountType('%')}>
                        <span className="dollar-price"><i className="fa fa-percent dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target="percent">
                        Percent discount
                    </UncontrolledTooltip>
                    <Button id={"dollar"} className={(this.props.discountType === '$') ? "btn btn-secondary btn-sm sec-btn active" : 'btn btn-secondary btn-sm sec-btn'} onClick={() => this.props.handleClickDiscountType('$')}>
                        <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target="dollar">
                        Flat discount
                    </UncontrolledTooltip>
                </div> 
            </>
        )
    }
}
export default CrmDiscountBtn;