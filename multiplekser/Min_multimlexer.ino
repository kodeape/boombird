#include "Wire.h"
#include "ICM20600.h"
#define MUX_Adress 0x70 //Multiplexer adressen

ICM20600 icm20600(true);

float accz_0=0 , accz_1, accz_2= 0;


void TCA9548A(uint8_t i2c_bus){
  if (i2c_bus > 7) return;
  Wire.beginTransmission(MUX_Adress);
  Wire.write(1<<i2c_bus);
  Wire.endTransmission();
}

void setup() {
  Wire.begin();
  icm20600.initialize();
  Serial.begin(115200);
}

void loop() {


  TCA9548A(3);
  accz_0 = icm20600.getAccelerationZ();
  delay(50);

  TCA9548A(5);
  accz_1 = icm20600.getAccelerationZ();
  delay(50);

  
  TCA9548A(7);
  accz_2 = icm20600.getAccelerationZ();
  delay(50);

  Serial.print(accz_0);
  Serial.print(", ");
  Serial.print(accz_1);
  Serial.print(", ");
  Serial.println(accz_2);

}
