import type { Note } from "@/types/note";
import { ObjectId } from "mongodb";

export const _notes: Note[] = [
  {
    _id: "507f1f77bcf86cd799439014" as unknown as ObjectId,
    user_id: "user123",
    title: "Japanese Garden Photography Tips",
    description: "Capturing the serenity of Kyoto's traditional gardens",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Photography in Japanese Gardens"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Camera Settings:"},{"type":"text","text":" Best results with soft morning light"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Use aperture priority mode for depth"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Consider using polarizing filter for pond reflections"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/japan-photography",
    tags: ["photography", "japan", "travel"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439015" as unknown as ObjectId,
    user_id: "user123",
    title: "Sourdough Bread Making Guide",
    description: "My journey into artisanal bread baking",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Sourdough Basics"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Starter Care:"},{"type":"text","text":" Feed your starter every 12 hours"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Keep at room temperature"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Use unbleached flour for best results"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/sourdough-guide",
    tags: ["baking", "cooking", "recipes"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439016" as unknown as ObjectId,
    user_id: "user456",
    title: "React Performance Optimization",
    description: "Best practices for optimizing React applications",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"React Performance Tips"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Key Concepts:"},{"type":"text","text":" Understanding component lifecycle"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Use React.memo for pure components"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Implement proper key props in lists"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/react-optimization",
    tags: ["programming", "react", "performance"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439017" as unknown as ObjectId,
    user_id: "user789",
    title: "Urban Sketching Techniques",
    description: "Quick tips for capturing city life in your sketchbook",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Urban Sketching 101"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Materials Needed:"},{"type":"text","text":" Portable sketching kit essentials"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Waterproof ink pens"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Small watercolor set"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/urban-sketching",
    tags: ["art", "sketching", "urban"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439018" as unknown as ObjectId,
    user_id: "user123",
    title: "Home Garden Planning",
    description: "Planning my sustainable vegetable garden",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Garden Layout Planning"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Spring Planting:"},{"type":"text","text":" Organizing crops by sunlight needs"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Consider companion planting"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Plan irrigation system"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/garden-planning",
    tags: ["gardening", "sustainability", "planning"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439019" as unknown as ObjectId,
    user_id: "user456",
    title: "Music Production Basics",
    description: "Getting started with home music production",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Home Studio Setup"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Essential Equipment:"},{"type":"text","text":" Building your first home studio"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Audio interface selection"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Microphone placement techniques"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/music-production",
    tags: ["music", "production", "audio"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439020" as unknown as ObjectId,
    user_id: "user789",
    title: "Minimalist Living Guide",
    description: "Transitioning to a minimalist lifestyle",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Minimalism Journey"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"First Steps:"},{"type":"text","text":" Beginning your decluttering process"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Start with one room at a time"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Create donation pile system"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/minimalism",
    tags: ["lifestyle", "minimalism", "organization"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439021" as unknown as ObjectId,
    user_id: "user123",
    title: "Daily Meditation Practice",
    description: "Building a consistent meditation routine",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Meditation Fundamentals"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Morning Routine:"},{"type":"text","text":" Starting your day mindfully"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Choose a quiet space"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Set a consistent time"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/meditation",
    tags: ["wellness", "meditation", "mindfulness"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439022" as unknown as ObjectId,
    user_id: "user456",
    title: "Language Learning Strategy",
    description: "Effective methods for learning Japanese",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Japanese Study Plan"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Daily Practice:"},{"type":"text","text":" Structured approach to language learning"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Kanji practice schedule"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Immersion techniques"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/japanese-learning",
    tags: ["language", "japanese", "learning"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
  {
    _id: "507f1f77bcf86cd799439023" as unknown as ObjectId,
    user_id: "user789",
    title: "Coffee Brewing Methods",
    description: "Exploring different coffee preparation techniques",
    content:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"Coffee Brewing Guide"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"bold"}],"text":"Pour-Over Method:"},{"type":"text","text":" Achieving the perfect cup"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Grind size importance"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Water temperature control"}]}]}]}]}',
    is_public: true,
    share_link: "https://notes.example.com/coffee-brewing",
    tags: ["coffee", "brewing", "food"],
    note_thumbnail:
      "https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/note-thumbnail-ivmpLfDWc1HFGLQJ9LFNDpFaX0ktuG.jpg",
  },
];
