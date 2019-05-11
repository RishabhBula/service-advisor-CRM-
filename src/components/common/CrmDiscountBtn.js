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
                        <span class="dollar-price"><i class="fa fa-percent dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target="percent">
                        Will allow percent discount
                    </UncontrolledTooltip>
                    <Button id={"dollar"} className={(this.props.discountType === '$') ? "btn btn-secondary btn-sm sec-btn active" : 'btn btn-secondary btn-sm sec-btn'} onClick={() => this.props.handleClickDiscountType('$')}>
                        <span class="dollar-price"><i class="fa fa-dollar dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target="dollar">
                        Will allow flat discount
                    </UncontrolledTooltip>
                </div> 
            </>
        )
    }
}
export default CrmDiscountBtn;