import React, { useState, useEffect } from "react";
import { Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export const Message = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertType, setShowAlertType] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(null);
  const [latitude, setLatitude] = useState("");

  const sendMessageHandler = async (type) => {
    setShowAlert(false);
    setShowErrorAlert(null);
    axios({
      method: "post",
      url: "/sendSOS",
      data: {
        longitude,
        latitude,
        messageType: type,
      },
    }).then((res) => {
      setShowAlert(true);
      setShowAlertType(type);
    });
  };

  function success(pos) {
    const crd = pos.coords;
    setLatitude(crd.latitude);
    setLongitude(crd.longitude);
  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setShowErrorAlert(
      `ERROR: ${err.message} please refresh the page and give access your location `
    );
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }, []);

  return (
    <>
      {showAlert && (
        <Alert variant="success" className="text-center">
          Emergency Message to {showAlertType} sent
        </Alert>
      )}
      {showErrorAlert && (
        <Alert variant="danger" className="text-center">
          {showErrorAlert}
        </Alert>
      )}
      <div
        style={{ height: "100vh", marginTop: "150px" }}
        className="d-flex flex-column  align-items-center"
      >
        <h1>Emergency Message</h1>
        <Row className="w-100 mt-2">
          <Col className="text-end mr-2">
            <Button
              className="p-2"
              variant="primary"
              onClick={() => sendMessageHandler("contact")}
            >
              Send Emergency SMS to Contacts
            </Button>
          </Col>
          <Col className="text-start">
            <Button
              className="p-2"
              variant="primary"
              onClick={() => sendMessageHandler("police")}
            >
              Send Emergency SMS to Police
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};
