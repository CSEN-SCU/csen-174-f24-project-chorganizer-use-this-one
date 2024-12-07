import React, {useState} from 'react';
import { updateStatus } from '../../firebase/firebaseConfig';

import {View, Text, TouchableOpacity, FlatList, StyleSheet, Pressable} from 'react-native';

const ExpandableListItem = ({item}) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleStatus = async (item) => {
    //HI BACKEND PEOPLE! here you can toggle whether or not they completed the core, the current lines underneath handle it on the front end, but if you're passing in the task status then we can just use that :)
    console.log("im in the tsx, trying to update chore: ", item.chore);
    await updateStatus(item);
  
  };


  return (
    //ARRAN: this is the list containing the chores per room so for example: 
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.itemTouchable}>
        {/* this below is the name of the room */}
        <Text style={styles.itemTitle}>{item.name}</Text>
        {expanded ? <Text>🔼</Text> : <Text>🔽</Text>}
      </TouchableOpacity>
      {expanded && (
        // this below is iterating through the list of the chores per room
        <FlatList
          data={item.tasks}
          renderItem={({item}) => {
            return(
                <Pressable style={styles.choreItem} onPress={() => toggleStatus(item)}>
                    <View>
                        
                        <Text style={styles.h6}>{item.name}</Text>
                    </View>
                    {item.choreStatus ? <Text>✅</Text> : <Text>⭕️</Text>}
                </Pressable>
            )
          }}
        />
      )}
    </View>
  );
};


const ExpandableList = ({data}) => {
  const renderItem = ({item}) => <ExpandableListItem item={item} />;
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.name.toString()}
    />
  );
};

const styles = StyleSheet.create({
  choreItem: {
    backgroundColor: '#F3F5F6',
    width: '100%',
    marginVertical: 5,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    shadowColor: 'grey',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  h8: {
    color: '#656565',
    fontSize: 12,
  },
  h6: {
    color: '#656565',
    fontWeight: 'heavy',
    fontSize: 16,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#D0E1FD',
    borderRadius: 10,
    elevation: 3,
    color: '#656565',
  },
  itemTouchable: {
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  itemTitle: {
    color: '#656565',
    fontWeight: 'bold',
    fontSize: 24,
  },
  itemContent: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ExpandableList;