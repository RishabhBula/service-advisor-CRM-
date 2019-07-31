import React from "react";
import CheckIcon from "./../../assets/check.svg";

const DashboardPlanDetails = () => (
  <div className={"dashboard-plan-container dashboard-block-container"}>
    <div className={"image-container"}>
      <img src={CheckIcon} alt={""} />
    </div>
    <span>
      Currently <b className="text-success">Plan Name</b> has been activated.
      Your subscription will be renew on 20th July, 2020.
    </span>
  </div>
);

export default DashboardPlanDetails;
