import React, { Component } from "react";

class CrmDiscountBtn extends Component {
    render() {
        return(
            <>
                {/* <ul className="discount-button">
                    <li > */}
                    <button type="button"  className={(this.props.discountType==='%') ? "btn btn-secondary btn-sm active" :'btn btn-secondary btn-sm'} onClick={()=>this.props.handleClickDiscountType('%')}>
                        <span class="dollar-price"><i class="fa fa-percent dollar-icon"></i></span>
                    </button>
                    {/* </li>
                    <li > */}
                    <button type="button" className={(this.props.discountType === '$') ? "btn btn-secondary btn-sm sec-btn active" : 'btn btn-secondary btn-sm sec-btn'} onClick={() => this.props.handleClickDiscountType('$')}>
                        <span class="dollar-price"><i class="fa fa-dollar dollar-icon"></i></span>
                    </button>
                    {/* </li>
                </ul> */}
            </>
        )
    }
}
export default CrmDiscountBtn;