import 'react-native-reanimated'; // ← add this as FIRST import
import { StyleSheet, Text, View, TouchableHighlight, Image, Alert, BackHandler} from 'react-native';
import React, { useState } from 'react';
import Status from './components/Status';
import MessageList from './components/MessageList';
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import Toolbar from './components/Toolbar';
import Animated, { SlideInDown } from 'react-native-reanimated';

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
    isInputFocused: false,
  };

  handlePressToolbarCamera = () => {
    
  };
  handlePressToolbarLocation = () => {
    
  };
  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
    
  };
  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
    messages: [createTextMessage(text), ...messages],
    });
  };
  renderToolbar() {
  const { isInputFocused } = this.state;
  return (
    <Animated.View 
      entering={SlideInDown.duration(500)} // ← slides up from bottom on load
    >
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={this.handleSubmit}
        onChangeFocus={this.handleChangeFocus}
        onPressCamera={this.handlePressToolbarCamera}
        onPressLocation={this.handlePressToolbarLocation}
      />
    </Animated.View>
  );
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
        this.setState({
           fullscreenImageId: id,
            isInputFocused: false,
          }); 
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

  UNSAFE_componentWillMount() {
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
      {this.renderToolbar()}
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
