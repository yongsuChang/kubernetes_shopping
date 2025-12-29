import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const enResources = {
  "common": {
    "welcome": "Welcome to Shopping Mall", "search": "Search", "cart": "Cart",
    "login": "Login", "signup": "Signup", "home": "Home", "products": "Products",
    "mypage": "My Page", "admin": "Admin", "vendor": "Vendor", "loading": "Loading...",
    "confirm": "Confirm", "cancel": "Cancel", "logout": "Logout"
  },
  "home": {
    "hero_subtitle": "Your one-stop destination for everything you need.",
    "get_started": "Get Started", "login_promo": "Login to enjoy more personalized shopping features.",
    "latest_arrivals": "Latest Arrivals", "view_all": "View All", "details": "Details"
  },
  "auth": {
    "login_title": "Login", "signup_title": "Sign Up", "email": "Email", "password": "Password",
    "name": "Name", "role": "Role", "no_account": "Don't have an account?", "have_account": "Already have an account?",
    "vendor_name": "Vendor Name", "vendor_description": "Vendor Description", "vendor_email": "Vendor Email", "vendor_address": "Vendor Address"
  },
  "shop": {
    "add_to_cart": "Add to Cart", "item_added": "Item added to cart!", "no_products": "No products found matching your criteria.",
    "categories": "Categories", "all_products": "All Products", "order_summary": "Order Summary",
    "total": "Total", "checkout": "Proceed to Checkout", "place_order": "Place Order",
    "empty_cart": "Your cart is empty", "browse_products": "Browse Products"
  },
  "admin": {
    "dashboard": "Admin Dashboard", "vendor_mgmt": "Vendor Management", "user_mgmt": "User Management",
    "product_mgmt": "Platform Products", "reports": "System Reports", "status_active": "Active",
    "status_pending": "Pending", "status_inactive": "Inactive", "approve": "Approve", "reject": "Reject",
    "total_sales": "Total Sales", "total_users": "Total Users", "total_vendors": "Total Vendors", "pending_approvals": "Pending Approvals"
  },
  "vendor": {
    "dashboard": "Vendor Dashboard", "product_mgmt": "Product Management", "order_mgmt": "Order Fulfillment",
    "my_sales": "My Sales", "add_product": "Add New Product", "edit_product": "Edit Product",
    "delete_product": "Delete Product", "stock": "Stock", "price": "Price", "order_id": "Order ID",
    "customer": "Customer", "fulfillment_status": "Fulfillment Status", "quantity": "Quantity",
    "order_date": "Order Date", "address": "Address", "add_address": "Add New Address"
  }
};

const koResources = {
  "common": {
    "welcome": "쇼핑몰에 오신 것을 환영합니다", "search": "검색", "cart": "장바구니",
    "login": "로그인", "signup": "회원가입", "home": "홈", "products": "상품목록",
    "mypage": "마이페이지", "admin": "관리자", "vendor": "판매자", "loading": "로딩 중...",
    "confirm": "확인", "cancel": "취소", "logout": "로그아웃"
  },
  "home": {
    "hero_subtitle": "당신에게 필요한 모든 것이 있는 곳.",
    "get_started": "시작하기", "login_promo": "로그인하고 더 많은 기능을 이용해보세요.",
    "latest_arrivals": "최신 등록 상품", "view_all": "전체보기", "details": "상세보기"
  },
  "auth": {
    "login_title": "로그인", "signup_title": "회원가입", "email": "이메일", "password": "비밀번호",
    "name": "이름", "role": "권한", "no_account": "계정이 없으신가요?", "have_account": "이미 계정이 있으신가요?",
    "vendor_name": "업체명", "vendor_description": "업체 설명", "vendor_email": "업체 이메일", "vendor_address": "업체 주소"
  },
  "shop": {
    "add_to_cart": "장바구니 담기", "item_added": "상품이 장바구니에 담겼습니다!", "no_products": "검색 결과가 없습니다.",
    "categories": "카테고리", "all_products": "전체 상품", "order_summary": "주문 요약",
    "total": "합계", "checkout": "주문하기", "place_order": "결제하기",
    "empty_cart": "장바구니가 비어 있습니다", "browse_products": "상품 둘러보기"
  },
  "admin": {
    "dashboard": "관리자 대시보드", "vendor_mgmt": "입점 업체 관리", "user_mgmt": "사용자 관리",
    "product_mgmt": "전체 상품 관리", "reports": "시스템 리포트", "status_active": "활성",
    "status_pending": "승인 대기", "status_inactive": "비활성", "approve": "승인", "reject": "반려",
    "total_sales": "총 매출", "total_users": "총 사용자", "total_vendors": "총 업체 수", "pending_approvals": "승인 대기 중"
  },
  "vendor": {
    "dashboard": "판매자 대시보드", "product_mgmt": "상품 관리", "order_mgmt": "주문 처리",
    "my_sales": "내 매출", "add_product": "새 상품 등록", "edit_product": "상품 수정",
    "delete_product": "상품 삭제", "stock": "재고", "price": "가격", "order_id": "주문 번호",
    "customer": "고객명", "fulfillment_status": "처리 상태", "quantity": "수량",
    "order_date": "주문일", "address": "주소", "add_address": "새 배송지 추가"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enResources },
      ko: { translation: koResources }
    },
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: { escapeValue: false }
  });

export default i18n;