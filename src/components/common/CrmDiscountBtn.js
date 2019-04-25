import React, { Component } from "react";

class CrmDiscountBtn extends Component {
    render() {
        return(
            <>
                <ul className="discount-button">
                    <li >
                    <button type="button"  className={(this.props.discountType==='%') ? "btn btn-default btn-sm active" :'btn btn-default btn-sm'} onClick={()=>this.props.handleClickDiscountType('%')}>%</button>
                    </li>
                    <li >
                    <button type="button"  className={(this.props.discountType==='$') ? "btn btn-default btn-sm sec-btn active" :'btn btn-default btn-sm sec-btn'} onClick={()=>this.props.handleClickDiscountType('$')}>$</button>
                    </li>
                </ul>
            </>
        )
    }
}
export default CrmDiscountBtn;