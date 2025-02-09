#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <GoogleSignIn/GIDSignIn.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Firebase.h>


@implementation AppDelegate

//  - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
//  {
//    self.moduleName = @"Shush";
//    // You can add your custom initial props in the dictionary below.
//    // They will be passed down to the ViewController used by React Native.
//    self.initialProps = @{};

//    return [super application:application didFinishLaunchingWithOptions:launchOptions];
//  }
- (void)applicationDidBecomeActive:(UIApplication *)application {
// delete the badge
   [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
// delete the notifications
  [[UNUserNotificationCenter currentNotificationCenter] removeAllDeliveredNotifications];
}

- (BOOL)application:(UIApplication *)application
           openURL:(NSURL *)url
           options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

 BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
   openURL:url
   sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
   annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
 ];
 // Add any custom logic here.
 return handled;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 self.moduleName = @"Shush";
 // You can add your custom initial props in the dictionary below.
 // They will be passed down to the ViewController used by React Native.
 self.initialProps = @{};
 
 // You can skip this line if you have the latest version of the SDK installed
 [[FBSDKApplicationDelegate sharedInstance] application:application
   didFinishLaunchingWithOptions:launchOptions];
  
  [FIRApp configure];
 

 return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
