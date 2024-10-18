import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';


const ExpandableListItem = ({item}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.itemTouchable}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {expanded ? <Text>🔼</Text> : <Text>🔽</Text>}
      </TouchableOpacity>
      {expanded && (
        <FlatList
          data={item.tasks}
          renderItem={({item}) => (
            <View style={styles.choreItem}>
            <View>
                <Text style={styles.h8}>{item.time}</Text>
                <Text style={styles.h6}>{item.chore}</Text>
            </View>
            {item.status ? <Text>✅</Text> : <Text>⭕️</Text>}
            </View>
          )}
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
