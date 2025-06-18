// Mock user and posts for structure
export const mockUser = {
  first_name: "Việt",
  last_name: "Thanh",
  avatar: "https://ui-avatars.com/api/?name=Viet+Thanh",
  role: "Người dùng",
};
export const mockPosts = [
  {
    id: 1,
    user: mockUser,
    content:
      "Sân có nhân viên túc trực thường xuyên, có quầy bán nước cho mọi người có thể nghỉ ngơi sau giờ chơi. Ưu đãi về giá cả!",
    createdAt: "2024-06-18T09:50:00",
    courtId: "1",
    courtData: {
      id: "1",
      name: "Sân Thành Tiến Vũ",
      location: "123 Âu Cơ, Liên Chiểu, Đà Nẵng",
      description:
        "Sân có nhân viên túc trực thường xuyên, có quầy bán nước cho mọi người có thể nghỉ ngơi sau giờ chơi. Ưu đãi về giá cả!",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      ],
      number: 6,
      timeslot: [],
      timeslotStatus: [],
    },
  },
  // ... more mock posts
];