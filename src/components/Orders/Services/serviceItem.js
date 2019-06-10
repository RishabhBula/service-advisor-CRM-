import React, { Component } from "react";
import {
  Card,
  Col,
  Input,
  FormGroup,
  Row,
  Button,
  InputGroup,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  FormFeedback,
  UncontrolledTooltip
} from "reactstrap";
import NoDataFound from "../../common/NoFound";
import CrmDiscountBtn from "../../common/CrmDiscountBtn";
import { toast } from "react-toastify";
import Async from "react-select/lib/Async";
import { LabelColorOptions } from "../../../config/Color"
import { getSumOfArray } from "../../../helpers"
import { CrmCannedServiceModal } from "../../common/CrmCannedServiceModal"
import { ConfirmBox } from "../../../helpers/SweetAlert";
import recommandUser from "../../../assets/recommand-user.png"
import recommandTech from "../../../assets/recommand-tech.png"

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
      technicianData: {
        label: "Type to select technician",
        value: ""
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
      services,
      customerUserComment
    } = this.props.serviceReducers
    this.setState({
      services,
      customerComment: customerUserComment ? customerUserComment.customerComment : '',
      userRecommendations: customerUserComment ? customerUserComment.userRecommendations : ""
    })
  }
  componentDidUpdate = ({ serviceReducers }) => {
    if (serviceReducers !== this.props.serviceReducers) {
      const {
        services,
        customerUserComment
      } = this.props.serviceReducers
      this.setState({
        services,
        customerComment: customerUserComment ? customerUserComment.customerComment : '',
        userRecommendations: customerUserComment ? customerUserComment.userRecommendations : ""
      }, () => {
        let Sindex
        const serviceList = [...this.state.services]
        if (serviceList && serviceList.length) {

          serviceList[serviceList.length - 1].serviceItems.map((sItem, sIndex) => {
            Sindex = sIndex
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
                sItem.subTotalValue = (serviceList[serviceList.length - 1].serviceItems[sIndex].cost || (serviceList[serviceList.length - 1].serviceItems[sIndex].hours) || (serviceList[serviceList.length - 1].serviceItems[sIndex].tierSize ? serviceList[serviceList.length - 1].serviceItems[sIndex].tierSize[0].cost : null))
              }
            }
            this.setState({
              services: serviceList
            })
            return true
          })
          if (serviceList[serviceList.length - 1].serviceSubTotalValue) {
            let serviceTotal = serviceList[serviceList.length - 1].serviceSubTotalValue
            const serviceSubTotal = serviceList[serviceList.length - 1].serviceItems.length ? serviceList[serviceList.length - 1].serviceItems[Sindex].subTotalValue : null
            serviceTotal.push(serviceSubTotal)
            serviceList[serviceList.length - 1].serviceSubTotalValue = serviceTotal
            serviceList[serviceList.length - 1].serviceTotal = getSumOfArray(serviceList[serviceList.length - 1].serviceSubTotalValue)
            this.setState({
              services: serviceList,
            })
          }
          serviceList[serviceList.length - 1].epa.value = ''
          serviceList[serviceList.length - 1].discount.value = ''
          serviceList[serviceList.length - 1].taxes.value = ''
        }
        this.setState({
          technicianData: {
            label: serviceList && serviceList.length ? serviceList[serviceList.length - 1].technician ? `${serviceList[serviceList.length - 1].technician.firstName} ${serviceList[serviceList.length - 1].technician.lastName}` : 'Type to select technician' : '',
            value: serviceList && serviceList.length ? serviceList[serviceList.length - 1].technician ? serviceList[serviceList.length - 1].technician._id : '' : ''
          },
          services: serviceList
        })
        return true
      })
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
    this.props.handleServiceModal(serviceType, index, this.state.services)
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
        selectedTechnician: {
          label: e.label,
          value: e.value
        }
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

  handleSeviceAdd = () => {
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
    }
  }

  handleRemoveService = async (index) => {
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
    serviceData[index].isConfirmedValue.value = true
    serviceData[index].isConfirmedValue.type = name
    serviceData[index].isButtonValue = ''
    if (serviceData[index][name].type === "%" && name !== 'discount') {
      // if (serviceData[index].serviceItems.length) {
      //   const serviceTotalValue = []
      //   serviceData[index].serviceItems.map((item, index) => {
      //     const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
      //     serviceTotalValue.push(parseFloat(serviceSubTotal))
      //     return true
      //   })
      //   tempServiceTotal = getSumOfArray(serviceTotalValue)
      // }
      const TaxedTotalValue = (parseFloat(serviceData[index][name].value) / 100) * parseFloat(serviceData[index].serviceTotal)
      serviceData[index].serviceTotal = parseFloat(serviceData[index].serviceTotal) + parseFloat(TaxedTotalValue)
    } else if (serviceData[index][name].type === "$" && name !== 'discount') {
      // let tempServiceTotal
      // if (serviceData[index].serviceItems.length) {
      //   const serviceTotalValue = []
      //   serviceData[index].serviceItems.map((item, index) => {
      //     const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
      //     serviceTotalValue.push(parseFloat(serviceSubTotal))
      //     return true
      //   })
      //   tempServiceTotal = getSumOfArray(serviceTotalValue)
      // }
      serviceData[index].serviceTotal = parseFloat(serviceData[index][name].value) + parseFloat(serviceData[index][name].value)
    } else if (serviceData[index][name].type === "%" && name === 'discount') {
      // if (serviceData[index].serviceItems.length) {
      //   const serviceTotalValue = []
      //   serviceData[index].serviceItems.map((item, index) => {
      //     const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
      //     serviceTotalValue.push(parseFloat(serviceSubTotal))
      //     return true
      //   })
      //   tempServiceTotal = getSumOfArray(serviceTotalValue)
      // }
      const TaxedTotalValue = (parseFloat(serviceData[index][name].value) / 100) * parseFloat(serviceData[index].serviceTotal)
      serviceData[index].serviceTotal = parseFloat(serviceData[index].serviceTotal) - parseFloat(TaxedTotalValue)
    } else {
      // let tempServiceTotal
      // if (serviceData[index].serviceItems.length) {
      //   const serviceTotalValue = []
      //   serviceData[index].serviceItems.map((item, index) => {
      //     const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
      //     serviceTotalValue.push(parseFloat(serviceSubTotal))
      //     return true
      //   })
      //   tempServiceTotal = getSumOfArray(serviceTotalValue)
      // }
      serviceData[index].serviceTotal = parseFloat(serviceData[index][name].value) + parseFloat(serviceData[index][name].value)
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
      this.handleLabelName('', Mindex, sIndex)
    })
  }
  handleLabelName = (e, Mindex, sIndex) => {
    if (e) {
      const { value } = e.target
      const serviceData = [...this.state.services]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = value
      this.setState({
        services: serviceData
      })
    } else {
      const serviceData = [...this.state.services]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = ''
      this.setState({
        services: serviceData
      })
    }
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
  handleSavedLabelDelete = async (labelData) => {
    const { value } = await ConfirmBox({
      text: "you want to remove this label?"
    });
    if (!value) {
      return;
    }
    const payload = {
      _id: labelData._id,
      isDeleted: true
    }
    this.props.deleteLabel(payload)
  }
  render() {
    const { services, selectedTechnician, customerComment,
      userRecommendations, isServiceSubmitted, openCannedService, technicianData } = this.state
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
    return (
      <>
        <div className={"w-100"}>
          <Row className={"comment-section ml-0 mb-4"}>
            <Col md={"6"} className={"d-flex pl-0 column"}>
              <span className={"icon"}>
                <img src={recommandUser} alt={"recommandUser"} />
              </span>
              <FormGroup className={"flex-one mb-0"}>
                <Input type={"textarea"} maxLength={"250"} value={customerComment} name={"customerComment"} onChange={this.handleOnChange} rows={"3"} col={"12"} placeholder={"Customer Comments"} />
              </FormGroup>
            </Col>
            <Col md={"6"} className={"d-flex pr-0 column"}>
              <span className={"icon"}>
                <img src={recommandTech} alt={"recommandTech"} />
              </span>
              <FormGroup className={"flex-one mb-0"}>
                <Input type={"textarea"} maxLength={"250"} value={userRecommendations} name={"userRecommendations"} onChange={this.handleOnChange} rows={"3"} col={"12"} placeholder={"Recommendations"} />
              </FormGroup>
            </Col>
          </Row>
          <div className={"pb-2"}>
            {
              services && services.length ?
                <Button color={""} onClick={() => this.handleCannedServiceModal()} className={"browse-btn"}>
                  <i class="icons cui-settings"></i> Browse service</Button> : null
            }
          </div>
          {
            services && services.length ? services.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <Card className={"service-card"}>
                    <div className={"custom-form-modal"}>
                      <div className={"service-card-header-block d-flex flex-row"}>
                        <div className={"service-card-header"}>
                          <Input
                            placeholder={"Enter a name for this service"}
                            onChange={(e) => this.handleChange(e, index)} name={"serviceName"}
                            value={item && item.serviceName ? item.serviceName : ''}
                            maxLength={"100"}
                            invalid={isServiceSubmitted && item.isError && !item.serviceName}
                            size={"lg"}
                          />
                          <FormFeedback>
                            {item.isError && isServiceSubmitted && !item.serviceName
                              ? "Service name is required."
                              : null}
                          </FormFeedback>
                        </div>
                        <div className={"service-card-btn-block flex-one d-flex align-items-center"}>
                          <div className={((technicianData.value === null || technicianData.value === "") && (item.technician === null || item.technician === "")) || ((item.technician === null || item.technician === "")) ? "pr-2 mr-2 cursor_pointer notValue" : "pr-2 mr-2 cursor_pointer isValue"} id={`tech${index}`}>
                            <img className={""} src={"/assets/img/expert.svg"} width={"30"} alt={"technician"} />
                          </div>
                          <UncontrolledTooltip placement="top" target={`tech${index}`}>
                            {((technicianData.value === null || technicianData.value === "") && (item.technician === null || item.technician === "")) || ((item.technician === null || item.technician === "")) ? "Assign a technician" : "Update technician"}
                          </UncontrolledTooltip>
                          <div className={
                            item.note ? "pr-2 cursor_pointer isValue" : "pr-2 cursor_pointer notValue"
                          } id={`note${index}`}>
                            <img className={""} src={"/assets/img/writing .svg"} width={"30"} alt={"Notes"} />
                          </div>
                          <UncontrolledTooltip placement="top" target={`note${index}`}>
                            {item.note ? "Update note" : "Add a note"}
                          </UncontrolledTooltip>
                          <UncontrolledPopover trigger="legacy" placement="bottom" target={`tech${index}`} className={"service-note-popover"}>
                            {
                              console.log("item.technician item.technician item.technician", item.technician, technicianData)

                            }
                            <Async
                              className={"w-100 form-select"}
                              placeholder={"Type Technician name"}
                              loadOptions={this.loadTechnician}
                              value={
                                technicianData.value !== '' && item.technician !== "" ?
                                  technicianData :
                                  selectedTechnician
                              }
                              isClearable={item.technician !== '' ? true : false}
                              noOptionsMessage={() => "Type Technician name"}
                              onChange={e => this.handleTechnicianAdd(e, index, item.technician)}
                            />
                          </UncontrolledPopover>
                          <UncontrolledPopover trigger="legacy" placement="bottom" target={`note${index}`} className={"service-note-popover"}>
                            <Input
                              type={"textarea"}
                              onChange={(e) => this.handleChange(e, index)}
                              name={"note"}
                              value={item.note}
                              maxLength={"200"}
                              rows={"2"} cols={"3"}
                              placeholder={"Add Note for this service"}
                            />
                          </UncontrolledPopover>

                        </div>
                      </div>
                      <table className={"table matrix-table service-table"}>
                        <thead>
                          <tr className={"service-table-head"}>
                            <th width="400" className={"pl-3"}>DESCRIPTION</th>
                            <th width="150" className={"text-center"}>PRICE</th>
                            <th width="150" className={"text-center"}>QTY</th>
                            <th width="150" className={"text-center"}>HRS</th>
                            <th width="300" className={"text-center"}>DISCOUNT</th>
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
                                    <td className={"text-capitalize pl-3"}><b>{service.serviceType || '-'}</b>: {service.description || service.brandName || service.discription || '-'}</td>
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
                                        <div className={"service-customer-discount"}>
                                          <CrmDiscountBtn discountType={service.discount.type} handleClickDiscountType={(data) => this.handleClickDiscountType(data, sIndex, index)} />
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <InputGroup>
                                        <div className="input-group-prepend">
                                          <Button disabled color={"secondary"} size={"sm"}>
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
                                    <td className={"text-center"}>

                                      {
                                        service.label && service.label.length ?
                                          service.label.map((label, lIndex) => {
                                            return (
                                              <>
                                                {
                                                  label.isAddLabel ?
                                                    <div>
                                                      <span key={lIndex} style={{
                                                        background: label.color
                                                      }} className={"status-label-btn"} >
                                                        {label.name}

                                                        <span className={"close-icon"}
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
                                              <Input value={service.label[service.label.length - 1].name} onChange={(e) => this.handleLabelName(e, index, sIndex)} placeholder={"Enter a label name."} />
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
                                                  <div className={"d-flex"} key={Lindex}>
                                                    <Button key={Lindex} style={{
                                                      background: data.labelColor
                                                    }} className={"btn-sm btn-block label-btn"} onClick={() => this.handleAddLabelFromList(index, sIndex, data.labelColor, data.labelName)} type="button">
                                                      {data.labelName}
                                                    </Button>
                                                    <span id={`remove${Lindex}${sIndex}${index}`} className={"pl-2 mt-2"} style={{ cursor: "pointer" }} onClick={() => this.handleSavedLabelDelete(data)}><i className={"icons cui-trash"}></i></span>
                                                    <UncontrolledTooltip target={`remove${Lindex}${sIndex}${index}`}>
                                                      Remove {data.labelName}
                                                    </UncontrolledTooltip>
                                                  </div>
                                                )
                                              }) : null
                                          }
                                        </PopoverBody>
                                      </UncontrolledPopover>

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
                    </div>
                    <div className={"p-2 d-flex justify-content-between calculation-section"}>
                      <ul className={"calculation-btn-block m-0 p-0"}>
                        <li id={`epa${index}`} onClick={() => {
                          this.handleTaxeButtons(index, "EPA")
                        }}>EPA {item.epa && item.epa.type === '$' ? item.epa.type : null}{item.epa && item.epa.value ? item.epa.value : 0}{item.epa && item.epa.type === '%' ? item.epa.type : null}
                        </li>
                        <li id={`disc${index}`} onClick={() => {
                          this.handleTaxeButtons(index, "Discount")
                        }} >Discount {item.discount && item.discount.type === '$' ? item.discount.type : null}{item.discount && item.discount.value ? item.discount.value : 0}{item.discount && item.discount.type === '%' ? item.discount.type : null}
                        </li>
                        <li
                          id={`tax${index}`}
                          onClick={() => {
                            this.handleTaxeButtons(index, "Taxes")
                          }}>Taxes {item.taxes && item.taxes.type === '$' ? item.taxes.type : null}{item.taxes && item.taxes.value ? item.taxes.value : 0}{item.taxes && item.taxes.type === '%' ? item.taxes.type : null}
                        </li>
                      </ul>
                      <div className={"service-total-block"}>
                        <h4>Service Total: <span className={"dollor-icon"}>${item.serviceTotal ? parseFloat(item.serviceTotal).toFixed(2) : 0.00}</span></h4>
                      </div>
                      <UncontrolledTooltip placement={"top"} target={`epa${index}`}>
                        Add EPA to service total
                      </UncontrolledTooltip>
                      <UncontrolledTooltip placement={"top"} target={`disc${index}`}>
                        Add Discount to service total
                      </UncontrolledTooltip>
                      <UncontrolledTooltip placement={"top"} target={`tax${index}`}>
                        Add Taxes to service total
                      </UncontrolledTooltip>
                    </div>

                    <div className={"tax-disc-cal"}>
                      {
                        item.isButtonValue === 'EPA' ?
                          <Row className={"m-2"}>
                            <Col md={"4"} lg={"4"} className={"p-0"}>
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
                            <Col md={"8"} lg={"8"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.epa && item.epa.type ? item.epa.type : "%"} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "epa")} />
                                <Button className={"btn-sm ml-2 mr-2 btn-success"} onClick={() => { this.handleValueConfirmed(index, "epa") }}>
                                  Submit
                                </Button>
                                <Button className={"btn-sm mr-2 btn-danger"}
                                  onClick={() => {
                                    this.handleRemoveTaxes(index)
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }
                      {
                        item.isButtonValue === 'Discount' ?
                          <Row className={"m-2"}>
                            <Col md={"4"} lg={"4"} className={"p-0"}>
                              <InputGroup>
                                {item.discount && item.discount.type === '$' ?
                                  <div className="input-group-prepend">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-dollar"}></i>
                                    </Button>
                                  </div> : null}
                                <Input id="discount" name="discount" onChange={(e) => { this.handleTaxesAdd(e, index, "epa") }} type={"text"} maxLength="5" placeholder={"Discount"} />
                                {item.discount && item.discount.type === '%' ?
                                  <div className="input-group-append">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-percent"}></i>
                                    </Button>
                                  </div> : null}
                              </InputGroup>
                            </Col>
                            <Col md={"8"} lg={"8"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.discount.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "discount")} />
                                <Button onClick={() => { this.handleValueConfirmed(index, "discount") }} className={"btn-sm ml-2 mr-2 btn-success"}>
                                  Submit
                                </Button>
                                <Button className={"btn-sm mr-2 btn-danger"} onClick={() => {
                                  this.handleRemoveTaxes(index)
                                }}>Cancel</Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }
                      {
                        item.isButtonValue === 'Taxes' ?
                          <Row className={"m-2"}>
                            <Col md={"4"} lg={"4"} className={"p-0"}>
                              <InputGroup>
                                {item.taxes && item.taxes.type === '$' ?
                                  <div className="input-group-prepend">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-dollar"}></i>
                                    </Button>
                                  </div> : null}
                                <Input name="taxes" onChange={(e) => { this.handleTaxesAdd(e, index) }} type={"text"} maxLength="5" placeholder={"Taxes"} />
                                {item.taxes && item.taxes.type === '%' ?
                                  <div className="input-group-append">
                                    <Button color={"primary"} size={"sm"}>
                                      <i className={"fa fa-percent"}></i>
                                    </Button>
                                  </div> : null}
                              </InputGroup>
                            </Col>
                            <Col md={"8"} lg={"8"} className={"pr-0"}>
                              <div className={"d-flex"}>
                                <CrmDiscountBtn discountType={item.taxes.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "taxes")} />
                                <Button onClick={() => { this.handleValueConfirmed(index, "taxes") }} className={"btn-sm ml-2 mr-2 btn-success"}>
                                  Submit
                                </Button>
                                <Button className={"btn-sm mr-2 btn-danger"} onClick={() => {
                                  this.handleRemoveTaxes(index)
                                }}>Cancel</Button>
                              </div>
                            </Col>
                          </Row> :
                          null
                      }

                    </div>

                    <div className={"service-card-footer"}>
                      <div className={"service-utility-btn"}>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'part')}>
                          <i class="nav-icon icons icon-puzzle"></i>&nbsp; Add Part
                          </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'tire')} >
                          <i class="nav-icon icons icon-support"></i>&nbsp; Add Tire
                          </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'labor')}>
                          <i class="nav-icon icons icon-user"></i>&nbsp; Add Labor
                          </Button>{/* 
                          <Button className={"mr-2"} onClick={() => this.handleServiceModalOpenAdd(index, 'subContract')}>Add Subcontract</Button> */}
                      </div>
                      <div >
                        <Button className={"mr-3 btn-dashed"} onClick={() => this.handleAddCannedService(item, index)} >Save as canned service</Button>
                        <Button
                          className="btn btn-remove btn-outline-danger"
                          onClick={() => this.handleRemoveService(index)}
                          id={`remove-service-${index}`}
                        >
                          <i className="fa fa-trash" /> &nbsp;Remove
                          </Button>
                        <UncontrolledTooltip target={`remove-service-${index}`}>
                          Click to remove this service
                          </UncontrolledTooltip>
                      </div>
                    </div>

                  </Card>
                </React.Fragment>
              )
            }) : null
          }
          <div className="d-flex pb-4 justify-content-between">
            <div>
              <Button color={""} onClick={() => this.handleSeviceAdd()} className={"mr-3 browse-btn"} id={"add-service"}>
                <i class="icon-plus icons "></i> Add New Service
            </Button>
              <UncontrolledTooltip placement="top" target={"add-service"}>
                Click to Add a new service
              </UncontrolledTooltip>
              <Button color={""} onClick={() => this.handleCannedServiceModal()} className={"mr-3 browse-btn"} id={"browse-service"}>
                <i class="icons cui-settings"></i> Browse service</Button>
              <UncontrolledTooltip placement="top" target={"browse-service"}>
                Click to browse canned services
              </UncontrolledTooltip>
            </div>
            {
              this.state.services && this.state.services.length ?
                <Button color={""} className={"btn-blue pull-right"} onClick={
                  () => {
                    this.handleServiceSubmit(this.state.services, customerComment, userRecommendations)
                  }
                }>Submit Services</Button> : null
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
