# Mobile QA Checklist for Wallace Restaurant QR Ordering App

## ✅ Mobile-First Design Requirements

### Viewport & Layout
- [x] **Mobile viewport meta tag**: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- [x] **Safe area support**: Uses `env(safe-area-inset-*)` for iOS notched devices
- [x] **Single-column layout**: Default layout is single-column optimized for phones
- [x] **Touch targets**: All interactive elements are ≥44px height
- [x] **Responsive breakpoints**: Mobile-first with sm/md/lg enhancements only

### Navigation & UX Patterns
- [x] **Bottom navigation**: Cart and checkout use bottom sheet patterns
- [x] **No sidebars**: Categories use horizontal scroll chips at top
- [x] **Sticky elements**: Header and category selector are sticky
- [x] **Bottom cart bar**: Fixed bottom bar with total + checkout, doesn't overlap content
- [x] **Safe area padding**: Bottom elements respect iOS safe areas

### Typography & Readability
- [x] **Base font size**: 16px+ for mobile readability
- [x] **Contrast ratios**: Text meets WCAG AA standards
- [x] **Line height**: Adequate spacing for mobile reading
- [x] **Font weights**: Clear hierarchy with proper weights

### Touch Interactions
- [x] **Button sizes**: Minimum 44px touch targets
- [x] **Spacing**: Adequate spacing between interactive elements
- [x] **Feedback**: Hover/tap states for all interactive elements
- [x] **Gestures**: Support for swipe/scroll where appropriate

## 📱 Device Testing Checklist

### iPhone Testing (375×812, 390×844)
- [ ] **iPhone SE (375×667)**: Smallest iPhone test
- [ ] **iPhone 12/13 (390×844)**: Standard iPhone
- [ ] **iPhone 12/13 Pro Max (428×926)**: Largest iPhone
- [ ] **iOS Safari**: Test in Safari browser
- [ ] **Chrome iOS**: Test in Chrome on iOS
- [ ] **Notched devices**: Test safe area handling

### Android Testing (360×800, 412×915)
- [ ] **Small Android (360×640)**: Minimum supported size
- [ ] **Standard Android (360×800)**: Common Android size
- [ ] **Large Android (412×915)**: Large Android phone
- [ ] **Chrome Android**: Primary browser testing
- [ ] **Samsung Internet**: Samsung browser testing

### Cross-Platform Testing
- [ ] **Chrome DevTools**: Device emulation testing
- [ ] **Real devices**: Physical device testing
- [ ] **Different screen densities**: @1x, @2x, @3x pixel ratios
- [ ] **Portrait/Landscape**: Both orientations

## 🎯 Core Functionality Testing

### Customer Ordering Flow
- [ ] **QR Code Scanning**: Direct to table-specific ordering
- [ ] **Table Recognition**: Correct table number display
- [ ] **Menu Loading**: Categories and items load properly
- [ ] **Category Navigation**: Horizontal scrolling works smoothly
- [ ] **Item Selection**: Add to cart functionality
- [ ] **Cart Management**: Bottom sheet, quantity updates, item removal
- [ ] **Checkout Process**: Order placement with table assignment
- [ ] **Order Tracking**: Real-time status updates
- [ ] **Order History**: View past orders with status timeline

### Admin Dashboard (Mobile)
- [ ] **Dashboard Loading**: Stats and orders display correctly
- [ ] **Order Management**: Status updates work on mobile
- [ ] **Menu Editor**: Full-screen forms work on phones
- [ ] **QR Management**: Mobile grid layout doesn't break
- [ ] **Navigation**: Admin navigation works on mobile

### Real-time Features
- [ ] **Order Status Updates**: Real-time status changes
- [ ] **Menu Availability**: Live updates when items become unavailable
- [ ] **New Orders**: Immediate appearance in admin dashboard
- [ ] **Connection Handling**: Graceful handling of connection issues

## 🔧 Technical Performance

### Loading Performance
- [ ] **Initial Load**: <3 seconds on 3G
- [ ] **Image Optimization**: Proper sizing and lazy loading
- [ ] **Bundle Size**: Optimized JavaScript bundles
- [ ] **Cache Strategy**: Proper service worker caching

### Touch Performance
- [ ] **Scroll Performance**: 60fps smooth scrolling
- [ ] **Animation Performance**: Smooth transitions
- [ ] **Input Responsiveness**: No lag on touch interactions
- [ ] **Gesture Recognition**: Accurate touch/tap handling

### Network Performance
- [ ] **Offline Support**: Basic offline functionality
- [ ] **Network Fallback**: Graceful degradation
- [ ] **API Response Times**: <500ms for most operations
- [ ] **Real-time Latency**: <1 second for updates

## 🚨 Critical Issues to Check

### Showstoppers
- [ ] **Cart functionality broken**: Cannot add/remove items
- [ ] **Checkout fails**: Order placement doesn't work
- [ ] **Payment issues**: Price calculation errors
- [ ] **Real-time updates not working**: Status changes don't propagate
- [ ] **QR code routing**: Table assignment incorrect

### Major Issues
- [ ] **UI overlapping**: Elements overlap on mobile
- [ ] **Touch targets too small**: <44px interactive elements
- [ ] **Text unreadable**: Font sizes too small or poor contrast
- [ ] **Navigation broken**: Cannot access key features
- [ ] **Performance issues**: Slow loading or laggy interactions

### Minor Issues
- [ ] **Visual inconsistencies**: Alignment or spacing issues
- [ ] **Missing hover states**: Poor interactive feedback
- [ ] **Typography hierarchy**: Unclear text importance
- [ ] **Empty states**: Poor or missing empty state designs

## 📋 Testing Scenarios

### Customer Journey
1. **QR Code Entry**: Scan QR → Table assignment → Menu loads
2. **Browse Menu**: Category navigation → Item selection → View details
3. **Cart Management**: Add items → Modify quantities → Remove items
4. **Checkout**: Review order → Place order → Get confirmation
5. **Order Tracking**: View status → Real-time updates → Completion

### Admin Journey
1. **Dashboard View**: View stats → See active orders → Monitor status
2. **Order Management**: Update status → View details → Handle issues
3. **Menu Management**: Edit items → Update availability → Price changes
4. **QR Management**: Create tables → Generate codes → Print/manage

### Edge Cases
1. **Network Issues**: Poor connection → Offline behavior → Reconnection
2. **Concurrent Orders**: Multiple tables ordering simultaneously
3. **Menu Changes**: Availability changes during ordering
4. **Device Rotation**: Portrait/landscape transitions
5. **Browser Issues**: Different mobile browsers and versions

## ✅ Acceptance Criteria

### Must Pass
- All core functionality works on target mobile devices
- Touch targets meet minimum size requirements
- Real-time features function correctly
- Performance meets minimum standards
- No critical security vulnerabilities

### Should Pass
- Good user experience on target devices
- Consistent design across platforms
- Proper error handling and feedback
- Accessibility standards met
- Cross-browser compatibility

### Could Pass
- Enhanced features on larger devices
- Progressive enhancement for desktop
- Advanced gesture support
- Additional browser support
- Performance optimizations