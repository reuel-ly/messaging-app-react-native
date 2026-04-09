import { StyleSheet, Text, View, TouchableHighlight, Image, Alert, BackHandler} from 'react-native';
import React, { useState } from 'react';
import Status from './components/Status';
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from './components/Toolbar';



export default class App extends React.Component {
  
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
  }

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  }
  
  handlePressMessage = ({ id, type }) => { 
    switch (type) {
      case 'text':
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              this.setState(({ messages }) => ({
                messages: messages.filter(message => message.id !== id),
              }));
            },
          },
        ]
      );
      break;
      
      case 'image':
        this.setState({ fullscreenImageId: id }); 
        break;
      default:
        break;
    };
  }

  renderMessageList() {
    const { messages } = this.state;
    
    return (
      <View 
        style={styles.content}>
        <MessageList messages={messages} 
        onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state; 
    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId); 
    if (!image) return null;

    const { uri } = image; 
    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    )
  }

  componentWillMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => { 
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) { 
        this.dismissFullscreenImage(); 
        return true;
      }
      return false;
    });
  }
  componentWillUnmount() {
     this.subscription.remove(); 
  }

  
  render() {
    return (
    <View style={styles.container}>
      <Status />
      {this.renderMessageList()}
      {this.renderFullscreenImage()}
    </View>
    )  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
   content: {
    flex: 1,
    backgroundColor: 'white',
    
  },

  fullscreenOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
    zIndex: 100, 
  },

  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },

})
