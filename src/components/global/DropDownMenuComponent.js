import React from 'react';
import {Box, Select} from 'native-base';
//Components
//selectedValue={service}
export default function DropDownMenu() {
  return (
    <Box>
      <Select
        minWidth="200"
        accessibilityLabel="Choose Service"
        placeholder="Choose Service"
        _selectedItem={{
          bg: 'teal.600',
        }}
        mt={1}
        onValueChange={itemValue => {
          //setService(itemValue);
        }}>
        <Select.Item label="UX Research" value="ux" />
        <Select.Item label="Web Development" value="web" />
        <Select.Item label="Cross Platform Development" value="cross" />
        <Select.Item label="UI Designing" value="ui" />
        <Select.Item label="Backend Development" value="backend" />
      </Select>
    </Box>
  );
}
