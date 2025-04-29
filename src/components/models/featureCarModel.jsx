"use client";
import React, { useState } from 'react';
import styled from 'styled-components';

const CarFeaturesSelection = () => {
  const [showModal, setShowModal] = useState(false);
  const [features, setFeatures] = useState({
     abs: false,
     airbags: false,
     alloyWheels: false,
     radio: false,
     heatedSeats: false,
     keylessEntry: false,
     powerMirrors: false,
     powerSteering: false,
     powerWindows: false,
     steeringSwitches: false,
     keylessStart: false,
     powerSeats: false,
     touchScreen: false,
     frontCamera: false,
     immobilizerKey: false,
     rearCamera: false,
     alarmSystem: false,
     ebd: false,
     parkingSensors: false,
     esp: false,
     isofix: false,
     cdPlayer: false,
     cassettePlayer: false,
     dvdPlayer: false,
     frontSpeakers: false,
     rearSpeakers: false,
     usbChargers: false,
     auxAudio: false,
     bluetoothSystem: false,
     sunroof: false,
     navigation: false,
     leatherSeats: false,
     centralLocking: false,
     cruiseControl: false,
     ac: false,
     thirdRowSeats: false,
     roofRack: false
   });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSelectAll = () => {
    const allFeaturesTrue = Object.fromEntries(
      Object.keys(features).map(key => [key, true])
    );
    setFeatures(allFeaturesTrue);
  };

  const handleClearAll = () => {
    const allFeaturesFalse = Object.fromEntries(
      Object.keys(features).map(key => [key, false])
    );
    setFeatures(allFeaturesFalse);
  };

  const handleConfirm = () => {
    setShowModal(false);
  };

  return (
    <FormContainer>
      <FormSection>
        <SectionTitle>
          <span>Features</span>
          <ShowMoreBtn onClick={() => setShowModal(true)}>Show more</ShowMoreBtn>
        </SectionTitle>
        
        <FeaturesGrid>
          <FeatureCheckbox>
            <input 
              type="checkbox" 
              id="abs" 
              name="abs" 
              checked={features.abs}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="abs">ABS</label>
          </FeatureCheckbox>
          
          <FeatureCheckbox>
            <input 
              type="checkbox" 
              id="airbags" 
              name="airbags" 
              checked={features.airbags}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="airbags">Airbags</label>
          </FeatureCheckbox>
          
          <FeatureCheckbox>
            <input 
              type="checkbox" 
              id="alloyWheels" 
              name="alloyWheels" 
              checked={features.alloyWheels}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="alloyWheels">Alloy Wheels</label>
          </FeatureCheckbox>
          
          <FeatureCheckbox>
            <input 
              type="checkbox" 
              id="radio" 
              name="radio" 
              checked={features.radio}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="radio">AM/FM Radio</label>
          </FeatureCheckbox>
        </FeaturesGrid>
      </FormSection>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Select Features</ModalTitle>
              <CloseBtn onClick={() => setShowModal(false)}>&times;</CloseBtn>
            </ModalHeader>
            
            {/* Comfort Section */}
            <CategoryTitle>Comfort</CategoryTitle>
            <CategoryDivider />
            <ModalFeaturesGrid>
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="heatedSeats" 
                  name="heatedSeats" 
                  checked={features.heatedSeats}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="heatedSeats">Heated Seats</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="keylessEntry" 
                  name="keylessEntry" 
                  checked={features.keylessEntry}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="keylessEntry">Keyless Entry</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="powerMirrors" 
                  name="powerMirrors" 
                  checked={features.powerMirrors}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="powerMirrors">Power Mirrors</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="powerSteering" 
                  name="powerSteering" 
                  checked={features.powerSteering}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="powerSteering">Power Steering</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="powerWindows" 
                  name="powerWindows" 
                  checked={features.powerWindows}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="powerWindows">Power Windows</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="steeringSwitches" 
                  name="steeringSwitches" 
                  checked={features.steeringSwitches}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="steeringSwitches">Steering Switches</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="keylessStart" 
                  name="keylessStart" 
                  checked={features.keylessStart}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="keylessStart">Keyless Start</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="powerSeats" 
                  name="powerSeats" 
                  checked={features.powerSeats}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="powerSeats">Power Seats</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="touchScreen" 
                  name="touchScreen" 
                  checked={features.touchScreen}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="touchScreen">Touch Screen</label>
              </FeatureCheckbox>
            </ModalFeaturesGrid>

            {/* Safety Section */}
            <CategoryTitle>Safety</CategoryTitle>
            <CategoryDivider />
            <ModalFeaturesGrid>
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="abs" 
                  name="abs" 
                  checked={features.abs}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="abs">ABS</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="airbags" 
                  name="airbags" 
                  checked={features.airbags}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="airbags">Airbags</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="frontCamera" 
                  name="frontCamera" 
                  checked={features.frontCamera}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="frontCamera">Front Camera</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="immobilizerKey" 
                  name="immobilizerKey" 
                  checked={features.immobilizerKey}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="immobilizerKey">Immobilizer Key</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="rearCamera" 
                  name="rearCamera" 
                  checked={features.rearCamera}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="rearCamera">Rear View Camera</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="alarmSystem" 
                  name="alarmSystem" 
                  checked={features.alarmSystem}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="alarmSystem">Alarm/Anti Theft</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="ebd" 
                  name="ebd" 
                  checked={features.ebd}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="ebd">EBD</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="parkingSensors" 
                  name="parkingSensors" 
                  checked={features.parkingSensors}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="parkingSensors">Parking Sensors</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="esp" 
                  name="esp" 
                  checked={features.esp}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="esp">ESP</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="isofix" 
                  name="isofix" 
                  checked={features.isofix}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isofix">ISOFIX</label>
              </FeatureCheckbox>
            </ModalFeaturesGrid>

            {/* Sound System Section */}
            <CategoryTitle>Sound System</CategoryTitle>
            <CategoryDivider />
            <ModalFeaturesGrid>
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="radio" 
                  name="radio" 
                  checked={features.radio}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="radio">AM/FM Radio</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="cdPlayer" 
                  name="cdPlayer" 
                  checked={features.cdPlayer}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="cdPlayer">CD Player</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="cassettePlayer" 
                  name="cassettePlayer" 
                  checked={features.cassettePlayer}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="cassettePlayer">Cassette Player</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="dvdPlayer" 
                  name="dvdPlayer" 
                  checked={features.dvdPlayer}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="dvdPlayer">DVD Player</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="frontSpeakers" 
                  name="frontSpeakers" 
                  checked={features.frontSpeakers}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="frontSpeakers">Front Speakers</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="rearSpeakers" 
                  name="rearSpeakers" 
                  checked={features.rearSpeakers}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="rearSpeakers">Rear Speakers</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="usbChargers" 
                  name="usbChargers" 
                  checked={features.usbChargers}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="usbChargers">USB Chargers</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="auxAudio" 
                  name="auxAudio" 
                  checked={features.auxAudio}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="auxAudio">Aux Audio In</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="bluetoothSystem" 
                  name="bluetoothSystem" 
                  checked={features.bluetoothSystem}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="bluetoothSystem">Bluetooth System</label>
              </FeatureCheckbox>
            </ModalFeaturesGrid>

            {/* Others Section */}
            <CategoryTitle>Others</CategoryTitle>
            <CategoryDivider />
            <ModalFeaturesGrid>
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="alloyWheels" 
                  name="alloyWheels" 
                  checked={features.alloyWheels}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="alloyWheels">Alloy Wheels</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="sunroof" 
                  name="sunroof" 
                  checked={features.sunroof}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="sunroof">Sunroof</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="navigation" 
                  name="navigation" 
                  checked={features.navigation}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="navigation">Navigation System</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="leatherSeats" 
                  name="leatherSeats" 
                  checked={features.leatherSeats}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="leatherSeats">Leather Seats</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="centralLocking" 
                  name="centralLocking" 
                  checked={features.centralLocking}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="centralLocking">Central Locking</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="cruiseControl" 
                  name="cruiseControl" 
                  checked={features.cruiseControl}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="cruiseControl">Cruise Control</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="ac" 
                  name="ac" 
                  checked={features.ac}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="ac">Air Conditioning</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="thirdRowSeats" 
                  name="thirdRowSeats" 
                  checked={features.thirdRowSeats}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="thirdRowSeats">Third Row Seats</label>
              </FeatureCheckbox>
              
              <FeatureCheckbox>
                <input 
                  type="checkbox" 
                  id="roofRack" 
                  name="roofRack" 
                  checked={features.roofRack}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="roofRack">Roof Rack</label>
              </FeatureCheckbox>
            </ModalFeaturesGrid>

            <ModalFooter>
              <SelectAllBtn onClick={handleSelectAll}>Select All</SelectAllBtn>
              <ClearBtn onClick={handleClearAll}>Clear</ClearBtn>
              <ConfirmBtn onClick={handleConfirm}>Confirm</ConfirmBtn>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  max-width: 800px;
`;

const FormSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCheckbox = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-right: 8px;
    width: 18px;
    height: 18px;
    accent-color: #002f34;
  }

  label {
    font-size: 14px;
    cursor: pointer;
  }
`;

const ShowMoreBtn = styled.button`
  color: #002f34;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: #005f6b;
  }
`;

const Modal = styled.div`
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
`;

const ModalContent = styled.div`
  background-color: white;
  margin: 50px auto;
  padding: 20px;
  border-radius: 4px;
  width: 80%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #222;
`;

const CloseBtn = styled.span`
  color: #aaa;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: #555;
  }
`;

const ModalFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin: 20px 0 10px 0;
  color: #002f34;
`;

const CategoryDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const SelectAllBtn = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #45a049;
  }
`;

const ClearBtn = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #d32f2f;
  }
`;

const ConfirmBtn = styled.button`
  background-color: #002f34;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #005f6b;
  }
`;

export default CarFeaturesSelection;