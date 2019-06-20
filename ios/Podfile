# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'spark' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for spark

  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'CxxBridge',
    'DevSupport',
    'RCTActionSheet',
    'RCTAnimation',
    'RCTGeolocation',
    'RCTImage',
    'RCTLinkingIOS',
    'RCTNetwork',
    'RCTSettings',
    'RCTText',
    'RCTVibration',
    'RCTWebSocket',
  ]
  # Explicitly include Yoga if you are using RN >= 0.42.0

  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

  # Third party deps podspec link

  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'

  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec' 
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

  pod 'RSKImageCropper', git: 'https://gitee.com/littleboer/RSKImageCropper.git', tag: '1.6.2'

  pod 'react-native-blur', :path => '../node_modules/react-native-blur'

  pod 'react-native-camera', :path => '../node_modules/react-native-camera'

  pod 'RNDeviceInfo', :path => '../node_modules/react-native-device-info'

  pod 'RNImageCropPicker', :path => '../node_modules/react-native-image-crop-picker'

  pod 'react-native-image-picker', :path => '../node_modules/react-native-image-picker'

  pod 'react-native-spinkit', :path => '../node_modules/react-native-spinkit'

  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

  pod 'rn-fetch-blob', :path => '../node_modules/rn-fetch-blob'

  pod 'react-native-amap3d', :path => '../node_modules/react-native-amap3d/lib/ios'

  target 'sparkTests' do
    inherit! :search_paths
    # Pods for testing
  end

end
