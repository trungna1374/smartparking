import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'
import axios from 'axios'

var moment = require('moment');
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')

const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Card Chart 1
const cardChartData1 = {
  labels: [],
  datasets: [
    {
      label: 'Car come in',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [],
    },
  ],
};

const cardChartOpts1 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const cardChartData2 = {
  labels: [],
  datasets: [
    {
      label: 'Car go out',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [],
    },
  ],
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

const mainChart = {
  labels: [],
  datasets: [
    {
      label: 'Cars come in',
      backgroundColor: 'transparent',
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: [],
    },
    {
      label: 'Cars go out',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: [],
    },
  ],
};

const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: 'index',
    position: 'nearest',
    callbacks: {
      labelColor: function (tooltipItem, chart) {
        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 1,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      radioSelected: 1,
      mainChartState: mainChart,
      mainChartOptsState: mainChartOpts,
      cardChartData1State: cardChartData1,
      cardChartOpts1State:cardChartOpts1,
      cardChartData2State: cardChartData2,
      cardChartOpts2State:cardChartOpts2,
    };
  }

  getHistoryByMonth = (data) => axios.get("/getHistoryByMonth", data)
    .then((res) => res.data)
  getHistoryByYear = (data) => axios.get("/getHistoryByYear", data)
    .then((res) => res.data)

  onRadioBtnClick(radioSelected) {
    console.log(moment(moment().format("YYYY-MM"), "YYYY-MM").daysInMonth())
    if (radioSelected === 1) this.getHistoryByMonth({ params: { month: 12, year: 2018, option: 0 } })
    else this.getHistoryByYear({ params: { year: 2018, option: 0 } })
    this.setState({
      radioSelected: radioSelected,
    });
  }

  updateChartMonth = (data) => {
    var mainChartClone = mainChart
    
  }

  updateChartYear = (data) => {
    
  }

  componentDidMount() {
    console.log(moment(moment().format("YYYY-MM"), "YYYY-MM").daysInMonth())
    this.getHistoryByMonth({ params: { month: moment().format("MM"), year: moment().format("YYYY"), option: 0 } }).then(res => {
      console.log(res)
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Park</CardTitle>
                    <div className="small text-muted">November 2015</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Month</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Year</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  <Line data={this.state.mainChartState} options={this.state.mainChartOptsState} height={300} />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <strong>The statistical chart gets in and out of parking lots</strong>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">9.823</div>
                <div>Cars come in</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.state.cardChartData1State} options={this.state.cardChartOpts1State} height={70} />
              </div>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">9.823</div>
                <div>Cars go out</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.state.cardChartData2State} options={this.state.cardChartOpts2State} height={70} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Statistics;
