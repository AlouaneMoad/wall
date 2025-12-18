# Wallace - Restaurant QR Ordering System

A production-ready, mobile-first restaurant QR ordering web app built with Next.js 15, TypeScript, and Supabase.

## 🚀 Features

### Customer Experience
- **Mobile-First Design**: Optimized for phone aspect ratios (390×844, 375×812, 360×800)
- **QR Code Ordering**: Scan QR codes to access table-specific menus
- **Real-time Cart**: Bottom sheet cart with quantity management
- **Order Tracking**: Live status updates (Pending → Received → Preparing → Finished)
- **Order History**: View past orders with detailed timelines

### Admin Dashboard
- **Mobile-Friendly Admin**: Works perfectly on phones for kitchen staff
- **Live Order Management**: Real-time order status updates
- **Menu Editor**: Full CRUD operations for menu items and categories
- **QR Code Management**: Generate and manage table QR codes
- **Analytics Dashboard**: Order statistics and revenue tracking

### Technical Features
- **Real-time Updates**: Supabase Realtime for live order status
- **Secure**: Row Level Security (RLS) for data protection
- **Responsive**: Mobile-first with desktop enhancements
- **Performance**: Optimized for 3G+ networks
- **PWA Ready**: Safe area support for iOS notched devices

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Realtime**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage for menu images
- **State Management**: Zustand for client state

## 📱 Mobile UX Requirements

### Core Design Principles
- **Single-column layout** optimized for phones
- **Bottom navigation** patterns (cart, checkout)
- **Horizontal scroll chips** for categories
- **44px minimum touch targets**
- **Sticky bottom bar** for cart total
- **Safe area support** for iOS notched devices

### Responsive Breakpoints
- **Mobile**: Default (320px+)
- **Tablet**: sm: (640px+)
- **Desktop**: md: (768px+)
- **Large**: lg: (1024px+)

## 🗄 Database Schema

### Core Tables
- `restaurants` - Restaurant information
- `tables` - Table management with QR codes
- `menu_categories` - Menu categories
- `menu_items` - Menu items with pricing
- `orders` - Customer orders
- `order_items` - Order line items
- `order_events` - Order status change history
- `profiles` - User roles and permissions

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Customer isolation**: Customers can only access their own orders
- **Role-based access**: Admin/staff permissions
- **API key protection**: Secure Supabase configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wallace-restaurant
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase database**
   ```bash
   # Run the SQL migrations in supabase/migrations/
   # 001_create_tables.sql
   # 002_rls_policies.sql  
   # 003_seed_data.sql
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Set up storage bucket for menu images
4. Configure RLS policies (included in migrations)

## 📋 Pages & Routes

### Customer Routes
- `/` - Main ordering page (mobile-first)
- `/orders` - Order history and tracking
- `/?t=TABLE_NUMBER` - Table-specific ordering

### Admin Routes  
- `/admin` - Admin dashboard
- `/admin/menu` - Menu editor
- `/admin/qr` - QR code management

## 🎯 Mobile QA Checklist

See [MOBILE_QA_CHECKLIST.md](./MOBILE_QA_CHECKLIST.md) for comprehensive mobile testing guidelines.

### Key Testing Areas
- **Touch Targets**: All interactive elements ≥44px
- **Safe Areas**: iOS notched device support
- **Performance**: <3s load time on 3G
- **Real-time**: Live order status updates
- **Cross-browser**: Safari, Chrome, Samsung Internet

## 🔒 Security Features

### Row Level Security (RLS)
- **Customers**: Can only read menu and access their own orders
- **Admin**: Full access to restaurant data
- **Staff**: Limited access to order management

### Data Protection
- **API Keys**: Secure Supabase configuration
- **Customer Isolation**: Orders scoped to customer sessions
- **Role Management**: Admin and staff roles with appropriate permissions

## 📊 Real-time Features

### Customer Updates
- Order status changes
- Menu item availability
- Cart synchronization

### Admin Updates
- New order notifications
- Order status changes
- Menu item updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static export with serverless functions
- **AWS**: Amplify or custom deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the Mobile QA checklist
- Review the documentation

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Supabase](https://supabase.com/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)

---

**Wallace** - Making restaurant ordering seamless and mobile-first.