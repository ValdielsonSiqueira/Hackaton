import React, { useState, useRef, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  PanResponder, 
  Dimensions 
} from "react-native";
import { WebView } from "react-native-webview";

const WebViewComponent = WebView as unknown as React.ComponentType<any>;
import type { MobileThemeColors } from "../theme/mobileTheme";
import { 
  Languages, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react-native";

interface VLibrasToolbarMobileProps {
  theme: { colors: MobileThemeColors; fontScale: number };
  topInset?: number;
  triggerToast?: (msg: string) => void;
  activeText?: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_WIDTH = 70;

const VLIBRAS_HTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { box-sizing: border-box; }
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
    }
    div[vw] {
      position: relative !important;
      width: 100% !important;
      height: 100% !important;
    }
    div[vw-plugin-wrapper] {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      margin: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      background: #F1F5F9 !important;
    }
    iframe {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      display: block !important;
    }
  </style>
</head>
<body>
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>
    var isReadyToWatchClose = false;

    function openVLibrasWidget() {
      if (window.VLibras && !window.vlibrasWidget) {
        window.vlibrasWidget = new window.VLibras.Widget('https://vlibras.gov.br/app');
        
        var attempts = 0;
        var checkExist = setInterval(function() {
          attempts++;
          var btn = document.querySelector('[vw-access-button]');
          var wrapper = document.querySelector('[vw-plugin-wrapper]');
          if (btn) {
            btn.click();
            btn.style.setProperty('display', 'none', 'important');
            if (wrapper) {
              wrapper.style.setProperty('position', 'absolute', 'important');
              wrapper.style.setProperty('top', '0', 'important');
              wrapper.style.setProperty('left', '0', 'important');
              wrapper.style.setProperty('width', '100%', 'important');
              wrapper.style.setProperty('height', '100%', 'important');
              wrapper.style.setProperty('max-width', '100%', 'important');
              wrapper.style.setProperty('max-height', '100%', 'important');
              wrapper.style.setProperty('box-shadow', 'none', 'important');
              wrapper.style.setProperty('border', 'none', 'important');
              wrapper.style.setProperty('border-radius', '0', 'important');
              wrapper.style.setProperty('margin', '0', 'important');
              wrapper.style.setProperty('background', '#F1F5F9', 'important');
            }
            clearInterval(checkExist);

            // Only permit close detection 3 seconds after successful opening
            setTimeout(function() {
              isReadyToWatchClose = true;
            }, 3000);
          }
          if (attempts > 50) clearInterval(checkExist);
        }, 200);
      }
    }
    
    window.addEventListener('load', openVLibrasWidget);
    document.addEventListener('DOMContentLoaded', openVLibrasWidget);
    setTimeout(openVLibrasWidget, 500);

    // Watch for close button click inside VLibras iframe/widget to notify React Native
    setInterval(function() {
      if (isReadyToWatchClose) {
        var wrapper = document.querySelector('[vw-plugin-wrapper]');
        if (!wrapper || wrapper.style.display === 'none' || !wrapper.classList.contains('active')) {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage("CLOSE");
            isReadyToWatchClose = false;
          }
        }
      }
    }, 600);

    function translateText(text) {
      if (window.vlibrasWidget && window.vlibrasWidget.translate) {
        window.vlibrasWidget.translate(text);
      }
    }
  </script>
</body>
</html>
`;

export const VLibrasToolbarMobile: React.FC<VLibrasToolbarMobileProps> = ({
  theme,
  topInset = 0,
  triggerToast,
  activeText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dockSide, setDockSide] = useState<"left" | "right">("right");

  const { colors } = theme;
  const isHighContrast = colors.mode === "high";

  const phraseToTranslate = activeText || "Olá! Selecione ou toque no texto de qualquer atividade da página para eu traduzir para a Língua Brasileira de Sinais.";
  const webViewRef = useRef<WebView>(null);

  // Animated position for dragging
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: 190 + topInset })).current;
  const lastPosition = useRef({ x: SCREEN_WIDTH - BUTTON_WIDTH, y: 190 + topInset });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: lastPosition.current.x,
          y: lastPosition.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_evt, gestureState) => {
        pan.flattenOffset();

        const currentX = lastPosition.current.x + gestureState.dx;
        const currentY = lastPosition.current.y + gestureState.dy;

        const clampedY = Math.max(60 + topInset, Math.min(SCREEN_HEIGHT - 160, currentY));

        const snapLeft = currentX + BUTTON_WIDTH / 2 < SCREEN_WIDTH / 2;
        const targetX = snapLeft ? 0 : SCREEN_WIDTH - BUTTON_WIDTH;
        const newDockSide = snapLeft ? "left" : "right";

        setDockSide(newDockSide);
        lastPosition.current = { x: targetX, y: clampedY };

        Animated.spring(pan, {
          toValue: { x: targetX, y: clampedY },
          useNativeDriver: false,
          friction: 6,
          tension: 40,
        }).start();

        if (Math.abs(gestureState.dx) < 6 && Math.abs(gestureState.dy) < 6) {
          setIsOpen(true);
        }
      },
    })
  ).current;

  // Whenever modal opens or active text changes, inject translation command into 3D avatar
  useEffect(() => {
    if (isOpen && webViewRef.current && phraseToTranslate) {
      const timer = setTimeout(() => {
        const jsCode = `
          try {
            if (typeof translateText === 'function') {
              translateText(${JSON.stringify(phraseToTranslate)});
            } else if (window.vlibrasWidget && window.vlibrasWidget.translate) {
              window.vlibrasWidget.translate(${JSON.stringify(phraseToTranslate)});
            }
          } catch (e) { console.error(e); }
          true;
        `;
        webViewRef.current?.injectJavaScript(jsCode);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, phraseToTranslate]);

  const badgeBg = isHighContrast ? "#000000" : "#0F62FE";
  const badgeBorderColor = isHighContrast ? "#FFFF00" : "transparent";
  const isLeft = dockSide === "left";

  return (
    <>
      {/* Draggable & Snap-to-Edge Floating VLibras Button */}
      <Animated.View
        style={[
          styles.draggableContainer,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={[
            styles.floatingTriggerBtn,
            isLeft ? styles.dockLeftBorderRadius : styles.dockRightBorderRadius,
            { backgroundColor: badgeBg, borderColor: badgeBorderColor, borderWidth: isHighContrast ? 2 : 0 },
          ]}
          onPress={() => setIsOpen(!isOpen)}
          accessibilityLabel="Abrir intérprete 3D VLibras em Língua de Sinais"
        >
          <Languages size={22} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          <Text style={[styles.floatingTriggerText, { color: isHighContrast ? "#FFFF00" : "#FFFFFF" }]}>
            VLIBRAS
          </Text>

          {isLeft ? (
            isOpen ? (
              <ChevronLeft size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
            ) : (
              <ChevronRight size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
            )
          ) : isOpen ? (
            <ChevronRight size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          ) : (
            <ChevronLeft size={16} color={isHighContrast ? "#FFFF00" : "#FFFFFF"} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Standalone Official VLibras Container Modal */}
      <Modal animationType="fade" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View 
            onStartShouldSetResponder={() => true} 
            style={[
              styles.standaloneContainer, 
              { borderColor: isHighContrast ? "#FFFF00" : "#CBD5E1", borderWidth: isHighContrast ? 2 : 1 }
            ]}
          >
            <WebViewComponent
              ref={webViewRef}
              originWhitelist={["*"]}
              source={{ html: VLIBRAS_HTML, baseUrl: "https://vlibras.gov.br/app/" }}
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mixedContentMode="always"
              allowUniversalAccessFromFileURLs={true}
              onMessage={(event: any) => {
                if (event?.nativeEvent?.data === "CLOSE") {
                  setIsOpen(false);
                }
              }}
              onError={() => {
                if (triggerToast) triggerToast("Carregando avatar 3D VLibras...");
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  floatingTriggerBtn: {
    width: BUTTON_WIDTH,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  dockRightBorderRadius: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  dockLeftBorderRadius: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  floatingTriggerText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  standaloneContainer: {
    width: Math.min(SCREEN_WIDTH * 0.88, 350),
    height: Math.min(SCREEN_HEIGHT * 0.75, 540),
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
