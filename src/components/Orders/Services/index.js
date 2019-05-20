import React, { Component } from "react";
import {
	Col,
	Row,
	FormGroup,
	Input,
	Button
} from "reactstrap";
import ServiceItem from "./serviceItem"
import CrmInventoryPart from '../../common/CrmInventoryPart'
import { CrmTyreModal } from '../../common/Tires/CrmTyreModal'

class Services extends Component {
	constructor(props) {
		super(props);
		this.state = {
			serviceItem: [
				{
					serviceName: "Service item data!!"
				}
			]
		};
	}

	handleSeviceAdd = () => {
		const { serviceItem } = this.state;
		if (serviceItem) {
			this.setState((state, props) => {
				return {
					serviceItem: state.serviceItem.concat([
						{
							serviceName: "Service item data!!"
						}
					])
				};
			});
		}
	}

	handleRemoveService = index => {
		const { serviceItem } = this.state;
		let t = [...serviceItem];
		t.splice(index, 1);
		if (serviceItem.length) {
			this.setState({
				serviceItem: t
			});
		}
	};
	handleServiceAdd = (index, serviceItem, ) => {
		const {
			modelInfoReducer,
			modelOperate,
		} = this.props;
		const { modelDetails } = modelInfoReducer;
		const {
			tireAddModalOpen,
			vendorAddModalOpen,
			partAddModalOpen,
			rateAddModalOpen
		} = modelDetails;
		switch (serviceItem) {
			case 'part':
				console.log("!!!!!!!!!!!!!", partAddModalOpen);
				return (
					<CrmInventoryPart
						isOpen={partAddModalOpen}
						toggle={() =>
							modelOperate({
								partAddModalOpen: !partAddModalOpen
							})
						} />
				)
			case 'tire':
				return (
					<CrmTyreModal
						tyreModalOpen={tireAddModalOpen}
						handleTierModal={() =>
							modelOperate({
								tireAddModalOpen: !tireAddModalOpen
							})
						} />
				)
			case 'labor':

				break;
			case 'subContract':

				break;
			default:
				return null;
		}
	}
	render() {
		const { serviceItem } = this.state
		const {
			modelInfoReducer,
			modelOperate,
		} = this.props;
		const { modelDetails } = modelInfoReducer;
		return (
			<div>
				<Row>
					<Col md={"6"}>
						<FormGroup>
							<Input type={"textarea"} rows={"4"} col={"12"} placeholder={"Customer Comments"} />
						</FormGroup>
					</Col>
					<Col md={"6"}>
						<FormGroup>
							<Input type={"textarea"} rows={"4"} col={"12"} placeholder={"Recommendations"} />
						</FormGroup>
					</Col>
				</Row>
				<div className={"d-flex justify-content-between pb-4"}>
					<ServiceItem
						serviceItem={serviceItem}
						handleRemoveService={this.handleRemoveService}
						handleServiceAdd={this.handleServiceAdd}
						modelOperate={modelOperate}
						modelDetails={modelDetails}
					/>
				</div>
				{this.handleServiceAdd()}
				<Button color={"primary"} onClick={this.handleSeviceAdd}>+ Add new service</Button>
			</div>
		);
	}
}

export default Services;
