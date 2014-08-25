#include <SPI.h>
#include "Adafruit_BLE_UART.h"

// bluetooth constants

// Connect CLK/MISO/MOSI to hardware SPI
// e.g. On UNO & compatible: CLK = 13, MISO = 12, MOSI = 11
#define ADAFRUITBLE_REQ 10
#define ADAFRUITBLE_RDY 2     // This should be an interrupt pin, on Uno thats #2 or #3
#define ADAFRUITBLE_RST 9
Adafruit_BLE_UART BTLEserial = Adafruit_BLE_UART(ADAFRUITBLE_REQ, ADAFRUITBLE_RDY, ADAFRUITBLE_RST);

// powertail ping pin
int controlPin = 8;

void setup() {
  pinMode(controlPin, OUTPUT); 
  digitalWrite(controlPin, LOW);
  
  // bluetooth init
  Serial.begin(9600);
  while(!Serial); // Leonardo/Micro should wait for serial init

  BTLEserial.begin();  ; 
}

/**************************************************************************/
/*!
    Constantly checks for new events on the nRF8001
*/
/**************************************************************************/
aci_evt_opcode_t laststatus = ACI_EVT_DISCONNECTED;

void loop() {
  
   // Tell the nRF8001 to do whatever it should be working on.
   BTLEserial.pollACI();
   
   // Ask what is our current status
  aci_evt_opcode_t status = BTLEserial.getState();
  // If the status changed....
  if (status != laststatus) {
    // print it out!
     if (status == ACI_EVT_DEVICE_STARTED) {
        Serial.println(F("* Bluetooth is on and ready"));
    }
    
    if (status == ACI_EVT_CONNECTED) {
        Serial.println(F("* iPhone connected!"));
    }
    
    if (status == ACI_EVT_DISCONNECTED) {
        Serial.println(F("* Connection lost"));
    }
    
    // OK set the last status change to this one
    laststatus = status;
  }
  
  if (status == ACI_EVT_CONNECTED) {
    // Lets see if there's any data for us!
     while (BTLEserial.available()) {
      char c = BTLEserial.read();
      Serial.print(c);
      String mystring = String(c);
      Serial.println(mystring);
      
      if (mystring == "0") {
         off(); 
      }
      
      if (mystring == "1") {
        on();
      }
     
    }
  }  
  
}

void on() {
  Serial.println("Turning lamp on");

  digitalWrite(controlPin, HIGH);
}

void off() {
  Serial.println("Turning lamp off");
  digitalWrite(controlPin, LOW);
}

