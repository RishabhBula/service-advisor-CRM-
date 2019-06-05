import React, { Component } from "react";
import {
  Card,
  Col,
  Input,
  FormGroup,
  Row,
  Label,
  Button,
  InputGroup,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  FormFeedback
} from "reactstrap";
import NoDataFound from "../../common/NoFound";
import CrmDiscountBtn from "../../common/CrmDiscountBtn";
import { toast } from "react-toastify";
import Async from "react-select/lib/Async";
import { LabelColorOptions } from "../../../config/Color"
import { getSumOfArray } from "../../../helpers"
import { CrmCannedServiceModal } from "../../common/CrmCannedServiceModal"
import { ConfirmBox } from "../../../helpers/SweetAlert";

class ServiceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNote: false,
      openCannedService: false,
      noteIndex: -1,
      customerComment: "",
      userRecommendations: "",
      selectedTechnician: {
        value: "",
        label: "Type to select technician"
      },
      services: [
        {
          isButtonValue: "",
          isConfirmedValue: {
            type: "",
            value: false
          },
          serviceName: "",
          technician: "",
          note: "",
          serviceItems: [],
          epa: {
            type: "%",
            value: ""
          },
          discount: {
            type: "%",
            value: "",
          },
          taxes: {
            type: "%",
            value: ""
          },
          serviceSubTotalValue: [],
          serviceTotal: "0.00",
          isError: false,
          isCannedAdded: false
        }
      ],
      isError: false,
      isServiceSubmitted: false
    };
  }
  componentDidMount = () => {
    const {
      services
    } = this.props.serviceReducers
    this.setState({
      services
    })
  }
  componentDidUpdate = ({ serviceReducers }) => {
    if (serviceReducers !== this.props.serviceReducers) {
      const {
        services
      } = this.props.serviceReducers
      this.setState({
        services
      }, () => {
        let Sindex
        this.state.services.map((item, index) => {
          item.serviceItems.map((sItem, sIndex) => {
            Sindex = sIndex
            const serviceData = [...this.state.services]
            if (sItem) {
              if (
                (sItem.cost && sItem.quantity) ||
                (
                  (
                    (sItem.tierSize ? sItem.tierSize[0].cost : null) &&
                    (sItem.tierSize ? sItem.tierSize[0].quantity : null)
                  ) ||
                  (sItem.hours && (sItem.rate ? sItem.rate.hourlyRate : 0)
                  )
                )
              ) {
                sItem.subTotalValue = parseFloat(sItem.cost || (sItem.tierSize ? sItem.tierSize[0].cost : 0) || (sItem.hours)) * parseFloat(sItem.quantity || (sItem.tierSize ? sItem.tierSize[0].quantity : 0) || (sItem.rate.hourlyRate))
              }
              else {
                sItem.subTotalValue = (serviceData[index].serviceItems[sIndex].cost || (serviceData[index].serviceItems[sIndex].hours) || (serviceData[index].serviceItems[sIndex].tierSize ? serviceData[index].serviceItems[sIndex].tierSize[0].cost : null))
              }
            }
            this.setState({
              services: serviceData
            })
            return true
          })

          const serviceData = [...this.state.services]
          if (serviceData[index].serviceSubTotalValue) {
            let serviceTotal = serviceData[index].serviceSubTotalValue
            const serviceSubTotal = serviceData[index].serviceItems.length ? serviceData[index].serviceItems[Sindex].subTotalValue : null
            serviceTotal.push(serviceSubTotal)
            serviceData[index].serviceSubTotalValue = serviceTotal
            serviceData[index].serviceTotal = getSumOfArray(services[index].serviceSubTotalValue)
            this.setState({
              services: serviceData
            })
          }
          return true
        })
      }
      )
    }
  }

  handleClickDiscountType = (value, index, Mindex) => {
    const serviceData = [...this.state.services]
    if (value === "%" && serviceData[Mindex].serviceItems[index].discount.value !== '') {
      if (parseInt(serviceData[Mindex].serviceItems[index].discount.value) < 100) {
        serviceData[Mindex].serviceItems[index].discount.type = value
      }
      else {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Enter percentage less than 100");
        }
      }
    } else if (value === "$" && serviceData[Mindex].serviceItems[index].discount.value !== '') {
      serviceData[Mindex].serviceItems[index].discount.type = value
    }
    else {
      serviceData[Mindex].serviceItems[index].discount.type = value
    }
    this.setState({
      services: serviceData
    })
  }
  handleClickEpaType = (value, index, name) => {
    const serviceData = [...this.state.services]
    if (name === 'epa') {
      if (value === "%" && serviceData[index].epa.value !== '') {
        if (parseInt(serviceData[index].epa.value) < 100) {
          serviceData[index].epa.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].epa.value !== '') {
        serviceData[index].epa.type = value
      }
      else {
        serviceData[index].epa.type = value
      }
      this.setState({
        services: serviceData
      })
    } else if (name === 'discount') {
      if (value === "%" && serviceData[index].discount.value !== '') {
        if (parseInt(serviceData[index].discount.value) < 100) {
          serviceData[index].discount.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].discount.value !== '') {
        serviceData[index].discount.type = value
      }
      else {
        serviceData[index].discount.type = value
      }
      this.setState({
        services: serviceData
      })
    } else {
      if (value === "%" && serviceData[index].taxes.value !== '') {
        if (parseInt(serviceData[index].taxes.value) < 100) {
          serviceData[index].taxes.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].taxes.value !== '') {
        serviceData[index].taxes.type = value
      }
      else {
        serviceData[index].taxes.type = value
      }
      this.setState({
        services: serviceData
      })
    }
  }
  handleServiceModalOpenAdd = async (index, serviceType) => {
    let modelDetails = {};
    switch (serviceType) {
      case 'part':
        modelDetails = {
          partAddModalOpen: true
        };
        break;
      case 'tire':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      case 'labor':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      default:
        break;
    }
    await this.props.modelOperate(modelDetails);
    this.props.handleServiceModal(serviceType, index)
  }

  handleDiscValue = (e, Mindex, index) => {
    const { name, value } = e.target
    let serviceData = [...this.state.services]
    const discountValue = serviceData[Mindex].serviceItems[index].discount
    let subTotalValue = serviceData[Mindex].serviceItems[index].subTotalValue
    const costValue = serviceData[Mindex].serviceItems[index].cost
    const quantityValue = serviceData[Mindex].serviceItems[index].quantity
    const tiresizeValue = serviceData[Mindex].serviceItems[index].tierSize
    const hourValue = serviceData[Mindex].serviceItems[index].hours
    const rateValue = serviceData[Mindex].serviceItems[index].rate ? serviceData[Mindex].serviceItems[index].rate.hourlyRate : 0
    if (discountValue.type === '%' && value) {
      if (parseFloat(value) > 100) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Enter percentage less than 100");
        }
        return
      } else {
        if (name === 'discount') {
          discountValue.value = value
        }
        serviceData[Mindex].serviceSubTotalValue = []
        const calDiscount = (parseFloat(value) / 100) * parseFloat(subTotalValue)
        subTotalValue = parseFloat(subTotalValue) - calDiscount
      }
    } else if (discountValue.type === '$' && value) {
      if (name === 'discount') {
        discountValue.value = value
      }
      serviceData[Mindex].serviceSubTotalValue = []
      subTotalValue = parseFloat(subTotalValue) - parseFloat(value)
    } else {
      if ((costValue && quantityValue) || ((tiresizeValue ? tiresizeValue[0].cost : null) && (tiresizeValue ? tiresizeValue[0].quantity : null))) {
        if (name === 'discount') {
          discountValue.value = value
        }
        serviceData[Mindex].serviceSubTotalValue = []
        subTotalValue = parseFloat(costValue || (tiresizeValue ? tiresizeValue[0].cost : 0)) * parseFloat(quantityValue || (tiresizeValue ? tiresizeValue[0].quantity : 0))
      }
      else if (hourValue && rateValue) {
        if (name === 'discount') {
          discountValue.value = value
        }
        serviceData[Mindex].serviceSubTotalValue = []
        subTotalValue = parseFloat(hourValue) * parseFloat(rateValue)
      }
      else {
        if (name === 'discount') {
          discountValue.value = value
        }
        serviceData[Mindex].serviceSubTotalValue = []
        subTotalValue = (costValue || (tiresizeValue ? tiresizeValue[0].cost : null) || hourValue)
      }
    }
    serviceData[Mindex].serviceItems[index].subTotalValue = parseFloat(subTotalValue).toFixed(2)
    this.setState({
      services: serviceData
    }, () => {
      let serviceTotalValue = serviceData[Mindex].serviceSubTotalValue
      serviceData[Mindex].serviceItems.map((item, Index) => {
        const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
        serviceTotalValue.push(parseFloat(serviceSubTotal))
        return true
      })
      serviceData[Mindex].serviceTotal = getSumOfArray(serviceTotalValue)
      this.setState({
        services: serviceData
      })
    })
  }

  handleCostChange = (e, Mindex, index) => {
    const { value } = e.target
    const serviceData = [...this.state.services]
    let subTotalValue = serviceData[Mindex].serviceItems[index].subTotalValue
    let costValue = serviceData[Mindex].serviceItems[index].cost
    const quantityValue = serviceData[Mindex].serviceItems[index].quantity
    const tireSizeValue = serviceData[Mindex].serviceItems[index].tierSize
    if ((value !== '' && quantityValue !== '') || (value !== '' && (tireSizeValue ? tireSizeValue[0].quantity !== '' : null))) {
      costValue = value
      serviceData[Mindex].serviceSubTotalValue = []
      subTotalValue = parseFloat(value) * parseFloat(quantityValue || (tireSizeValue ? tireSizeValue[0].quantity : 0))
    }
    else {
      costValue = 0
      subTotalValue = 0
      serviceData[Mindex].serviceSubTotalValue = []
    }
    serviceData[Mindex].serviceItems[index].subTotalValue = parseFloat(subTotalValue).toFixed(2)
    serviceData[Mindex].serviceItems[index].cost = parseFloat(costValue)
    this.setState({
      services: serviceData
    }, () => {
      let serviceTotalValue = serviceData[Mindex].serviceSubTotalValue
      serviceData[Mindex].serviceItems.map((item, Index) => {
        const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
        serviceTotalValue.push(parseFloat(serviceSubTotal))
        return true
      })
      serviceData[Mindex].serviceTotal = getSumOfArray(serviceTotalValue)
      this.setState({
        services: serviceData
      })
    })
  }
  handleQuantityChange = (e, Mindex, index) => {
    const { value } = e.target
    const serviceData = [...this.state.services]
    let subTotalValue = serviceData[Mindex].serviceItems[index].subTotalValue
    const costValue = serviceData[Mindex].serviceItems[index].cost
    let quantityValue = serviceData[Mindex].serviceItems[index].quantity
    const tireSizeValue = serviceData[Mindex].serviceItems[index].tierSize
    if ((value !== '' && costValue !== '') || (value !== '' && (tireSizeValue ? tireSizeValue[0].cost !== '' : null))) {
      quantityValue = value
      serviceData[Mindex].serviceSubTotalValue = []
      subTotalValue = parseFloat(value) * parseFloat(costValue || (tireSizeValue ? tireSizeValue[0].cost : 0))
    }
    else {
      quantityValue = 0
      serviceData[Mindex].serviceSubTotalValue = []
      subTotalValue = 0
    }
    serviceData[Mindex].serviceItems[index].subTotalValue = parseFloat(subTotalValue).toFixed(2)
    serviceData[Mindex].serviceItems[index].quantity = parseFloat(quantityValue)
    this.setState({
      services: serviceData
    }, () => {
      let serviceTotalValue = serviceData[Mindex].serviceSubTotalValue
      serviceData[Mindex].serviceItems.map((item, Index) => {
        const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
        serviceTotalValue.push(parseFloat(serviceSubTotal))
        return true
      })
      serviceData[Mindex].serviceTotal = getSumOfArray(serviceTotalValue)
      this.setState({
        services: serviceData
      })
    })
  }

  handleHourChange = (e, Mindex, index) => {
    const { value } = e.target
    const serviceData = [...this.state.services]
    let subTotalValue = serviceData[Mindex].serviceItems[index].subTotalValue
    let hourValue = serviceData[Mindex].serviceItems[index].hours
    const rateValue = serviceData[Mindex].serviceItems[index].rate ? serviceData[Mindex].serviceItems[index].rate.hourlyRate : 0
    if (value !== '' && rateValue) {
      hourValue = value
      subTotalValue = parseFloat(value) * parseFloat(rateValue)
    } else if (value !== '') {
      hourValue = value
      subTotalValue = parseFloat(value)
    }
    else {
      hourValue = 0
      subTotalValue = 0
    }
    serviceData[Mindex].serviceItems[index].subTotalValue = parseFloat(subTotalValue).toFixed(2)
    serviceData[Mindex].serviceItems[index].hours = parseFloat(hourValue)
    this.setState({
      services: serviceData
    })
  }
  handleChange = (e, index) => {
    const { value, name } = e.target;
    const serviceData = [...this.state.services]
    serviceData[index][name] = value
    this.setState({
      services: serviceData
    })
  }
  loadTechnician = (input, callback) => {
    const type = "5ca3473d70537232f13ff1fa"
    this.props.getUserData({ input, type, callback });
  };
  handleTechnicianAdd = (e, index) => {
    if (e && e.value) {
      const serviceData = [...this.state.services]
      serviceData[index].technician = e
      this.setState({
        services: serviceData,
      })
    } else {
      const serviceData = [...this.state.services]
      serviceData[index].technician = ""
      this.setState({
        services: serviceData,
        selectedTechnician: {
          label: "Type to select technician",
          value: ""
        },
      })
    }
  }

  handleSeviceAdd = async () => {
    this.setState({
      isError: true
    })
    if (this.state.services) {
      const services = [...this.state.services]
      const serviceData = [
        {
          isButtonValue: "",
          isConfirmedValue: {
            type: "",
            value: false
          },
          serviceName: "",
          technician: "",
          note: "",
          serviceItems: [],
          epa: {
            type: "%",
            value: ""
          },
          discount: {
            type: "%",
            value: "",
          },
          taxes: {
            type: "%",
            value: ""
          },
          serviceSubTotalValue: [],
          serviceTotal: "0.00",
          isError: false,
          isCannedService: false,
          isCannedAdded: false
        }
      ]
      services.push(serviceData[0])
      this.setState({
        services
      })
      await this.props.addPartToService(services)
    }
  }

  handleRemoveService = async(index) => {
    const { value } = await ConfirmBox({
      text: "Do you want to remove this service?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    const { services } = this.state;
    services[index].isCannedAdded = false
    let t = [...services];
    t.splice(index, 1);
    if (services.length) {
      this.setState({
        services: t
      });
    }
  };

  handleTaxeButtons = (index, value) => {
    const serviceData = [...this.state.services]
    serviceData[index].isButtonValue = value
    this.setState({
      services: serviceData
    })
  }

  handleRemoveTaxes = (index) => {
    const serviceData = [...this.state.services]
    serviceData[index].isButtonValue = ''
    this.setState({
      services: serviceData
    })
  }

  handleTaxesAdd = (e, index) => {
    const { name, value } = e.target
    const serviceData = [...this.state.services]
    serviceData[index][name].value = value
    if (serviceData[index].isConfirmedValue ? (serviceData[index].isConfirmedValue.value && serviceData[index].isConfirmedValue.type === name) : null) {
      this.setState({
        services: serviceData
      })
    }
  }
  handleValueConfirmed = (index, name) => {
    const serviceData = [...this.state.services]
    console.log("@@@@@@@@@@", serviceData[index]);

    serviceData[index].isConfirmedValue.value = true
    serviceData[index].isConfirmedValue.type = name
    serviceData[index].isButtonValue = ''
    console.log("*******name******", name, serviceData[index][name].type);
    if (serviceData[index][name].type === "%" && name !== 'discount') {
      let tempServiceTotal
      if (serviceData[index].serviceItems.length) {
        const serviceTotalValue = []
        serviceData[index].serviceItems.map((item, index) => {
          const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
          serviceTotalValue.push(parseFloat(serviceSubTotal))
          return true
        })
        tempServiceTotal = getSumOfArray(serviceTotalValue)
      }
      const TaxedTotalValue = (parseFloat(serviceData[index][name].value) / 100) * parseFloat(tempServiceTotal)
      console.log("@@@@@@@@@@@@@@@", TaxedTotalValue);

      serviceData[index].serviceTotal = parseFloat(tempServiceTotal) + parseFloat(TaxedTotalValue)
    }
    this.setState({
      services: serviceData
    })
  }
  handleOnChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleLabelColorSelect = (color, Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    serviceData[Mindex].serviceItems[sIndex].label[labelLength - 1].color = color
    this.setState({
      services: serviceData
    })
  }
  handleLabelAdd = (Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      services: serviceData
    }, () => {
      const labelConst =
      {
        color: "",
        name: "",
        isAddLabel: false
      }
      labelData.push(labelConst)
    })
  }
  handleLabelName = (e, Mindex, sIndex) => {
    const { value } = e.target
    const serviceData = [...this.state.services]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData[labelLength - 1].name = value
    this.setState({
      services: serviceData
    })
  }

  handleRemoveLabel = (Mindex, sIndex, lIndex) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData.splice(lIndex, 1)
    this.setState({
      services: serviceData
    })
  }
  handleSaveLabel = (Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const payload = labelData[labelLength - 1]
    this.props.addNewLabel(payload)
  }
  handleAddLabelFromList = (Mindex, sIndex, color, name) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    labelData[labelLength - 1].color = color
    labelData[labelLength - 1].name = name
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      services: serviceData
    },
      () => {
        const labelConst =
        {
          color: "",
          name: "",
          isAddLabel: false
        }
        labelData.push(labelConst)
      })
  }
  handleRemoveServiceItems = (Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const serviceItems = serviceData[Mindex].serviceItems
    serviceData[Mindex].serviceSubTotalValue = []
    serviceItems.splice(sIndex, 1)
    this.setState({
      services: serviceData
    }, () => {
      let serviceTotalValue = serviceData[Mindex].serviceSubTotalValue
      serviceData[Mindex].serviceItems.map((item, Index) => {
        const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
        serviceTotalValue.push(parseFloat(serviceSubTotal))
        return true
      })
      if (serviceTotalValue.length) {
        serviceData[Mindex].serviceTotal = getSumOfArray(serviceTotalValue)
      } else {
        serviceData[Mindex].serviceTotal = "0.00"
      }
      this.setState({
        services: serviceData
      })
    })
  }
  handleServiceSubmit = (serviceData, customerComment, userRecommendations) => {
    console.log("*********************Service data", serviceData);

    this.setState({
      isServiceSubmitted: true
    })
    const payload = {
      services: serviceData,
      customerComment: customerComment,
      userRecommendations: userRecommendations,
      orderId: this.props.orderId
    }
    let ele
    for (let index = 0; index < serviceData.length; index++) {
      const serviceContent = [...this.state.services]
      ele = serviceContent[index];
      if (ele.hasOwnProperty('serviceName') && ele.serviceName === '') {
        serviceContent[index].isError = true
        this.setState({
          services: serviceContent
        })
      } else {
        serviceContent[index].isError = false
        this.setState({
          services: serviceContent
        })
      }
    }
    if (ele.serviceName !== '') {
      this.props.addNewService(payload)
    }
  }
  handleCannedServiceModal = () => {
    this.setState({
      openCannedService: !this.state.openCannedService
    })
  }

  handleAddCannedService = (serviceData, index) => {
    const services = [...this.state.services]
    if (!serviceData.serviceName) {
      services[index].isError = true
    } else {
      services[index].isCannedService = true
      const payload =
      {
        services: [services[index]]
      }

      this.props.addNewService(payload)
    }
    this.setState({
      isServiceSubmitted: true,
      services
    })
  }
  handleCannedAddToService = (services) => {
    const SeriviceData = [...this.state.services]
    SeriviceData.push(services)
    this.handleCannedServiceModal()
    this.setState({
      services: SeriviceData
    })
  }
  render() {
    const { services, selectedTechnician, customerComment,
      userRecommendations, isServiceSubmitted, openCannedService } = this.state
    const { labelReducer, getCannedServiceList, serviceReducers } = this.props
    const LabelColors = (index, sIndex) => {
      const labelLength = services[index].serviceItems[sIndex].label.length
      return (
        LabelColorOptions.map((item, lIndex) => {
          return (
            <li key={lIndex}>
              <span onClick={() => this.handleLabelColorSelect(item.color, index, sIndex)} style={{
                background: item.color,
                position: "relative", top: "5px"
              }}>
                {
                  item.color === (services[index].serviceItems[sIndex].label ? services[index].serviceItems[sIndex].label[labelLength - 1].color : null) ?
                    <i className={"fa fa-check"} /> :
                    null
                }
              </span>
            </li>
          )
        })
      )
    }
    console.log("***************This is service state", services);

    return (
      <>
        <div>
          <Row>
            <Col md={"6"}>
              <FormGroup>
                <Input type={"textarea"} value={customerComment} name={"customerComment"} onChange={this.handleOnChange} rows={"4"} col={"12"} placeholder={"Customer Comments"} />
              </FormGroup>
            </Col>
            <Col md={"6"}>
              <FormGroup>
                <Input type={"textarea"} value={userRecommendations} name={"userRecommendations"} onChange={this.handleOnChange} rows={"4"} col={"12"} placeholder={"Recommendations"} />
              </FormGroup>
            </Col>
          </Row>
          <div className={"pb-2"}>
            <Button color={"primary"} onClick={() => this.handleCannedServiceModal()}>Browse service</Button>
          </div>
          {
            services && services.length ? services.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Card className={"service-card"}>
                    <div className={"custom-form-modal mt-3"}>
                      <Row>
                        <Col md={"6"}>
                          <FormGroup>
                            <Label htmlFor="name" className="customer-modal-text-style">
                              Service name <span className={"asteric"}>*</span>
                            </Label>
                            <div className="input-block">
                              <Input
                                placeholder={"Enter a name for this service"}
                                onChange={(e) => this.handleChange(e, index)} name={"serviceName"}
                                value={item.serviceName}
                                maxLength={"100"}
                                invalid={isServiceSubmitted && item.isError && !item.serviceName}
                              />
                              <FormFeedback>
                                {item.isError && isServiceSubmitted && !item.serviceName
                                  ? "Service name is required."
                                  : null}
                              </FormFeedback>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col md={"6"}>
                          <FormGroup>
                            <Label htmlFor="name" className="customer-modal-text-style">
                              Technician
                            </Label>
                            <Async
                              className={"w-100 form-select"}
                              placeholder={"Type Technician name"}
                              loadOptions={this.loadTechnician}
                              value={item.technician === "" ? selectedTechnician : item.technician}
                              isClearable={item.technician !== '' ? true : false}
                              noOptionsMessage={() => "Type Technician name"}
                              onChange={e => this.handleTechnicianAdd(e, index)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Col md="12">
                        <FormGroup>
                          <Label htmlFor="name" className="customer-modal-text-style">
                            Note
                          </Label>
                          <Input
                            type={"textarea"}
                            onChange={(e) => this.handleChange(e, index)}
                            name={"note"}
                            value={item.note}
                            maxLength={"200"}
                            rows={"2"} cols={"3"} />

                        </FormGroup>
                      </Col>
                      <table className={"table matrix-table"}>
                        <thead>
                          <tr>
                            <th width="250" className={"text-center"}>DESCRIPTION</th>
                            <th width="250" className={"text-center"}>PRICE</th>
                            <th width="250" className={"text-center"}>QTY</th>
                            <th width="250" className={"text-center"}>HRS</th>
                            <th width="250" className={"text-center"}>DISC</th>
                            <th width="150" className={"text-center"}>SUBTOTAL</th>
                            <th width="200" className={"text-center"}>STATUS</th>
                            <th width="30" className={"text-center"}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.services[index] && this.state.services[index].serviceItems.length ?
                              this.state.services[index].serviceItems.map((service, sIndex) => {
                                return (
                                  <tr>
                                    <td className={"text-capitalize"}><b>{service.serviceType || '-'}</b>: {service.description || service.brandName || service.discription || '-'}</td>
                                    <td>
                                      {
                                        (service.cost !== null || (service.tierSize ? service.tierSize[0].cost !== null : null)) && service.serviceType !== 'labor' ?
                                          <Input
                                            onChange={(e) => this.handleCostChange(e, index, sIndex)}
                                            name={"cost"}
                                            type="text"
                                            value={service.cost || (service.tierSize ? service.tierSize[0].cost : null) || 0}
                                          /> :
                                          null
                                      }
                                    </td>
                                    <td>
                                      {
                                        (service.quantity !== null || (service.tierSize ? service.tierSize[0].quantity !== null : null)) && service.serviceType !== 'labor' ?
                                          <Input
                                            type="text"
                                            onChange={(e) => this.handleQuantityChange(e, index, sIndex)}
                                            name={"quantity"}
                                            value={service.quantity || (service.tierSize ? service.tierSize[0].quantity : null) || 0}
                                          /> :
                                          null
                                      }
                                    </td>
                                    <td>
                                      {
                                        service.hours !== '' && service.serviceType === 'labor' ?
                                          <Input
                                            type={"text"}
                                            name={"hour"}
                                            onChange={(e) => this.handleHourChange(e, index, sIndex)}
                                            value={service.hours || 0}
                                          /> :
                                          null
                                      }
                                    </td>
                                    <td>
                                      <div className={"labor-discount"}>
                                        <InputGroup>
                                          {service.discount.type === '$' ?
                                            <div className="input-group-prepend">
                                              <Button color={"primary"} size={"sm"}>
                                                <i className={"fa fa-dollar"}></i>
                                              </Button>
                                            </div> : null}
                                          <Input id="discount" name="discount" type={"text"} value={service.discount.value} onChange={(e) => this.handleDiscValue(e, index, sIndex)} maxLength="5" placeholder={"Discount"} />
                                          {service.discount.type === '%' ?
                                            <div className="input-group-append">
                                              <Button color={"primary"} size={"sm"}>
                                                <i className={"fa fa-percent"}></i>
                                              </Button>
                                            </div> : null}
                                        </InputGroup>
                                        <CrmDiscountBtn discountType={service.discount.type} handleClickDiscountType={(data) => this.handleClickDiscountType(data, sIndex, index)} />
                                      </div>
                                    </td>
                                    <td>
                                      <InputGroup>
                                        <div className="input-group-prepend">
                                          <Button disabled color={"secondaty"} size={"sm"}>
                                            <i className={"fa fa-dollar"}></i>
                                          </Button>
                                        </div>
                                        <Input
                                          disabled
                                          value={
                                            service.subTotalValue
                                          }
                                        />
                                      </InputGroup>
                                    </td>
                                    <td>
                                      <div>
                                        {
                                          service.label && service.label.length ?
                                            service.label.map((label, lIndex) => {
                                              return (
                                                <>
                                                  {
                                                    label.isAddLabel ?
                                                      <div className={"d-flex"}>
                                                        <span key={lIndex} style={{
                                                          background: label.color
                                                        }} className={"btn-sm label-btn"} type="button">
                                                          {label.name}

                                                          <span
                                                            onClick={() => this.handleRemoveLabel(index, sIndex, lIndex)}
                                                          >
                                                            <i className="fas fa-times" />
                                                          </span>
                                                        </span>
                                                      </div>
                                                      :
                                                      null
                                                  }
                                                </>
                                              )
                                            }) :
                                            null
                                        }
                                        <Button id={`new${sIndex}${index}`} className={"btn-sm"} type="button">
                                          New +
                                        </Button>
                                        <UncontrolledPopover trigger="legacy" placement="bottom" target={`new${sIndex}${index}`}>
                                          <PopoverHeader>
                                            <div>
                                              <FormGroup className={"mb-0"}>
                                                <Input onChange={(e) => this.handleLabelName(e, index, sIndex)} placeholder={"Enter a label name."} />
                                                <ul className={"lable-color"} >
                                                  {LabelColors(index, sIndex)}
                                                </ul>
                                              </FormGroup>
                                              <Button disabled={(service.label ? !service.label[service.label.length - 1].name : null) && (service.label ? !service.label[service.label.length - 1].isButtonValue : null)} color="secondary" className={"btn-block btn-round"} onClick={() => this.handleLabelAdd(index, sIndex)}>Add Label</Button>
                                              <Button disabled={(service.label ? !service.label[service.label.length - 1].name : null) && (service.label ? !service.label[service.label.length - 1].isButtonValue : null)} color="secondary" className={"btn-block btn-round"} onClick={() => this.handleSaveLabel(index, sIndex)}>Add To Saved Label</Button>
                                            </div>
                                          </PopoverHeader>
                                          <PopoverBody>
                                            {
                                              labelReducer.label && labelReducer.label.length ?
                                                labelReducer.label.map((data, Lindex) => {
                                                  return (
                                                    <div className={"d-flex"}>
                                                      <Button key={Lindex} style={{
                                                        background: data.labelColor
                                                      }} className={"btn-sm btn-block label-btn"} onClick={() => this.handleAddLabelFromList(index, sIndex, data.labelColor, data.labelName)} type="button">
                                                        {data.labelName}
                                                      </Button>
                                                    </div>
                                                  )
                                                }) : null
                                            }
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </div>
                                    </td>
                                    <td>
                                      <Button
                                        size={"sm"}
                                        onClick={() => { this.handleRemoveServiceItems(index, sIndex) }}
                                        className={"btn-theme-transparent"}
                                      >
                                        <i className={"icons cui-trash"}></i>
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              }) :
                              <tr>
                                <td className={"text-center"} colSpan={12}>
                                  <NoDataFound showAddButton={false} message={"Currently there are no Service details added."} />
                                </td>
                              </tr>
                          }
                        </tbody>
                      </table>
                      <div className={"p-4"}>
                        <Button
                          className={"mr-2"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'part')}>
                          Add Part
                        </Button>
                        <Button
                          className={"mr-2"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'tire')} >
                          Add Tire
                        </Button>
                        <Button
                          className={"mr-2"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'labor')}>
                          Add Labor
                        </Button>{/* 
                        <Button className={"mr-2"} onClick={() => this.handleServiceModalOpenAdd(index, 'subContract')}>Add Subcontract</Button> */}
                      </div>

                      <Button
                        className="btn-sm btn btn-danger remove-tire-btn"
                        onClick={() => this.handleRemoveService(index)}
                      >
                        <i className="fas fa-times" />
                      </Button>
                    </div>
                    <div className={"p-4 d-flex justify-content-between"}>
                      <div>
                        <span onClick={() => {
                          this.handleTaxeButtons(index, "EPA")
                        }}>EPA {item.epa && item.epa.type === '$' ? item.epa.type : null}{item.epa && item.epa.value ? item.epa.value : 0}{item.epa && item.epa.type === '%' ? item.epa.type : null}</span>&nbsp; &nbsp;
                      <span onClick={() => {
                          this.handleTaxeButtons(index, "Discount")
                        }} >Discount {item.discount && item.discount.type === '$' ? item.discount.type : null}{item.discount && item.discount.value ? item.discount.value : 0}{item.discount && item.discount.type === '%' ? item.discount.type : null}</span>&nbsp; &nbsp;
                      <span
                          onClick={() => {
                            this.handleTaxeButtons(index, "Taxes")
                          }}>Taxes {item.taxes && item.taxes.type === '$' ? item.taxes.type : null}{item.taxes && item.taxes.value ? item.taxes.value : 0}{item.taxes && item.taxes.type === '%' ? item.taxes.type : null}</span>&nbsp; &nbsp;
                      </div>
                      <div>
                        <span>Service Total: ${parseFloat(item.serviceTotal).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={"m-2 d-flex justify-content-end"}>
                      <Button color={"secondary"} onClick={() => this.handleAddCannedService(item, index)}>Save as canned service</Button>
                    </div>
                    <div>
                      {
                        item.isButtonValue === 'EPA' ?
                          <Row className={"m-2"}>
                            <Col md={"2"} lg={"2"} className={"p-0"}>
                              <InputGroup>
                                {item.epa && item.epa.type === '$' ?
                                  <div className="input-group-prepend">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-dollar"}></i>
                                    </Button>
                                  </div> : null}
                                <Input id="EPA" name="epa" onChange={(e) => { this.handleTaxesAdd(e, index) }} type={"text"} maxLength="5" placeholder={"EPA"} />
                                {item.epa && item.epa.type === '%' ?
                                  <div className="input-group-append">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-percent"}></i>
                                    </Button>
                                  </div> : null}
                              </InputGroup>
                            </Col>
                            <Col md={"4"} lg={"4"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.epa && item.epa.type ? item.epa.type : "%"} handleClickDiscountType={(data) => this.handleClickEpaType(data, index)} />
                                <Button className={"btn-sm ml-2 mr-2"} onClick={() => { this.handleValueConfirmed(index, "epa") }}><i className={"icon-check"} /></Button>
                                <Button className={"btn-sm mr-2"}
                                  onClick={() => {
                                    this.handleRemoveTaxes(index)
                                  }}
                                ><i className="fas fa-times" /></Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }
                      {
                        item.isButtonValue === 'Discount' ?
                          <Row className={"m-2"}>
                            <Col md={"2"} lg={"2"} className={"p-0"}>
                              <InputGroup>
                                {item.epa && item.epa.type === '$' ?
                                  <div className="input-group-prepend">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-dollar"}></i>
                                    </Button>
                                  </div> : null}
                                <Input id="discount" name="discount" onChange={(e) => { this.handleTaxesAdd(e, index, "epa") }} type={"text"} maxLength="5" placeholder={"Discount%"} />
                                {item.epa && item.epa.type === '%' ?
                                  <div className="input-group-append">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-percent"}></i>
                                    </Button>
                                  </div> : null}
                              </InputGroup>
                            </Col>
                            <Col md={"4"} lg={"4"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.epa.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "discount")} />
                                <Button className={"btn-sm ml-2 mr-2"}><i className={"icon-check"} onClick={() => { this.handleValueConfirmed(index, "discount") }} /></Button>
                                <Button className={"btn-sm mr-2"} onClick={() => {
                                  this.handleRemoveTaxes(index)
                                }}><i className="fas fa-times" /></Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }
                      {
                        item.isButtonValue === 'Taxes' ?
                          <Row className={"m-2"}>
                            <Col md={"2"} lg={"2"} className={"p-0"}>
                              <InputGroup>
                                {item.epa && item.epa.type === '$' ?
                                  <div className="input-group-prepend">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-dollar"}></i>
                                    </Button>
                                  </div> : null}
                                <Input name="taxes" onChange={(e) => { this.handleTaxesAdd(e, index) }} type={"text"} maxLength="5" placeholder={"Taxes"} />
                                {item.epa && item.epa.type === '%' ?
                                  <div className="input-group-append">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-percent"}></i>
                                    </Button>
                                  </div> : null}
                              </InputGroup>
                            </Col>
                            <Col md={"4"} lg={"4"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.epa.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "taxes")} />
                                <Button className={"btn-sm ml-2 mr-2"}><i className={"icon-check"} onClick={() => { this.handleValueConfirmed(index, "taxes") }} /></Button>
                                <Button className={"btn-sm mr-2"} onClick={() => {
                                  this.handleRemoveTaxes(index)
                                }}><i className="fas fa-times" /></Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }

                    </div>
                  </Card>
                </React.Fragment>
              )
            }) : null
          }
          <div className="d-flex justify-content-between pb-4">
            <Button color={"primary"} onClick={() => this.handleSeviceAdd()}>+ Add new service</Button>
            <Button color={"primary"} onClick={() => this.handleCannedServiceModal()}>Browse service</Button>

            {
              this.state.services && this.state.services.length ?
                <Button color={"secondary"} onClick={
                  () => {
                    this.handleServiceSubmit(this.state.services, customerComment, userRecommendations)
                  }
                }>Submit services</Button> : null
            }
          </div>
          <CrmCannedServiceModal
            openCannedService={openCannedService}
            handleCannedServiceModal={this.handleCannedServiceModal}
            getCannedServiceList={getCannedServiceList}
            serviceReducers={serviceReducers}
            handleAddToService={this.handleCannedAddToService}
          />
        </div>
      </>
    );
  }
}

export default ServiceItem;
