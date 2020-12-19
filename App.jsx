import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from "react-native-paper";

const Home = ({navigation, route}) => {
  const [Oprice, setOprice] = useState("");
  const [Pdiscount, setPdiscount] = useState("");
  const [disprice, setdisprice] = useState("");
  const [Yousave, setYousave] = useState("");
  const [datalist, setdatalist] = useState([]);

  const calculate = () => {
    if(Oprice >= 0){
      if (Pdiscount >= 0 && Pdiscount < 100){
        var Tprice = Oprice - (Oprice  * (Pdiscount / 100));
        setdisprice(Tprice.toFixed(2));
        var Saved = Oprice - Tprice;
        setYousave(Saved.toFixed(2));
      }
    }
  };

  useEffect(() => {
    setdatalist(
      route.params !== undefined ? Object.values(route.params) : []
      );
  }, [route.params]);

  const SavingCal = () => {
    setdatalist(
      [...datalist,
        {
          id: Math.random().toString(),
          OrgPrice: Oprice,
          PerDiscount: Pdiscount,
          CalPrice: disprice,
        },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={{fontSize:20, marginTop: 3}}>Enter Original Price</Text>
        <TextInput keyboardType={"number-pad"} style={{borderWidth: 2, width: 200, fontSize: 20, marginLeft: 5}} 
        value={Oprice} onChangeText={(EnteredPrice) => setOprice(EnteredPrice)}/>
      </View>
      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop: 10}}>
        <Text style={{fontSize:20, marginTop: 3}}>Enter Discount (%)</Text>
        <TextInput keyboardType={"number-pad"} style={{borderWidth: 2, width: 200, fontSize: 20, marginLeft: 11}} value={Pdiscount} onChangeText={(EnteredPrice) => setPdiscount(EnteredPrice)}/>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{width: "50%", paddingTop: 10}}>
          <Button title="Calculate" color="brown" onPress={() => calculate()}/>
        </View>
      </View>
      <View>
        <Text style={{fontSize:20, color: "darkgreen", marginTop: 10}}>Final Price: {disprice}</Text>
        <Text style={{fontSize:20, color: "darkgreen"}}>Saved: {Yousave}</Text>
      </View>
      <View style={{width: "50%", paddingTop: 20, flexDirection: "row", justifyContent: "space-between"}}>
        <Button title="Save Calculation" color="brown" onPress={() => SavingCal()}/>
        <Button title="History" color="brown" onPress={() => navigation.navigate('HistoryS', datalist)}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const HistoryS = ({navigation, route}) => {
  const [datalisthis, setdatalisthis] = useState(route.params);

  const removeItem = (keyid) => {
    var data = datalisthis.filter(list => list.id != keyid);
    setdatalisthis([...data]);
  };

  const removedata = () => {
    Alert.alert(
      "Delete Calculations",
      "Want to Erase saved calculations?",
      [
        {text: "cancel", style: "cancel"},
        {text: "Yes", onPress: () => setdatalisthis([])},
      ],
      {cancelable: false}
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
        onPress={removedata}
        >
          <Button title="Delete All" color="black"/>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => navigation.navigate('Home', datalisthis)}
        >
          <Button title="Back" color="black"/>
        </TouchableOpacity>
      )
    });
  });

    return (
      <View style={{ flex: 1, alignItems: 'center'}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title numeric >Original Price</DataTable.Title>
            <DataTable.Title numeric >Discount</DataTable.Title>
            <DataTable.Title numeric >Final Price</DataTable.Title>
            <DataTable.Title numeric >-</DataTable.Title>
          </DataTable.Header>

            <ScrollView>
              {datalisthis.map((list) => (
                  <DataTable.Row key={list.id}>
                    <DataTable.Cell numeric>
                      {"$" + list.OrgPrice}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {list.PerDiscount + "%"}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {"$" + list.CalPrice}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <TouchableOpacity onPress={() => removeItem(list.id)}>
                        <Button title="X" color="red" />
                      </TouchableOpacity>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </ScrollView>
        </DataTable>
      </View>
    );
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Discount Calculator', headerTitleAlign: "center", headerStyle: {backgroundColor: "brown"},
            headerTitleStyle: {color: "white"}}} />
        <Stack.Screen name="HistoryS" component={HistoryS} options={{title: 'History Screen', headerTitleAlign: "center", headerStyle: { backgroundColor: "brown" },
            headerTitleStyle: { color: "white" }}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default App;