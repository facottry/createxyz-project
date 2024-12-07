"use client";
import React from "react";

function MainComponent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Web Development",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      videoCount: 12,
      instructor: "John Doe",
      level: "beginner",
      category: "development",
      published: true,
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      description: "Master advanced React concepts and patterns",
      videoCount: 8,
      instructor: "Jane Smith",
      level: "advanced",
      category: "development",
      published: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState("library");
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("development");

  const mockVideos = Array.from({ length: 50 })
    .fill()
    .map((_, i) => ({
      id: i + 1,
      title: `Video ${i + 1}`,
      duration: "10:00",
      thumbnail: `/thumbnails/video${i + 1}.jpg`,
    }));

  const onDragStart = (e, video) => {
    e.dataTransfer.setData("video", JSON.stringify(video));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const video = JSON.parse(e.dataTransfer.getData("video"));
    setSelectedVideos((prev) => [...prev, video]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleSaveCourse = () => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id
            ? {
                ...course,
                title: courseTitle,
                instructor,
                description,
                level,
                category,
                videos: selectedVideos,
                videoCount: selectedVideos.length,
              }
            : course
        )
      );
      setEditingCourse(null);
    } else {
      const newCourse = {
        id: Date.now(),
        title: courseTitle,
        instructor,
        description,
        level,
        category,
        videos: selectedVideos,
        videoCount: selectedVideos.length,
        published: false,
      };
      setCourses((prev) => [...prev, newCourse]);
    }
    setCourseTitle("");
    setInstructor("");
    setDescription("");
    setLevel("beginner");
    setCategory("development");
    setSelectedVideos([]);
    setActiveTab("courses");
  };

  const handlePublishCourse = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, published: !course.published }
          : course
      )
    );
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setInstructor(course.instructor);
    setDescription(course.description);
    setLevel(course.level);
    setCategory(course.category);
    setSelectedVideos(course.videos || []);
  };

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses];

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (course) => course.published === (filterStatus === "published")
      );
    }

    if (filterLevel !== "all") {
      filtered = filtered.filter((course) => course.level === filterLevel);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === filterCategory
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "videos") return b.videoCount - a.videoCount;
      if (sortBy === "level") return a.level.localeCompare(b.level);
      return 0;
    });
  }, [courses, sortBy, filterStatus, filterLevel, filterCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600">Coursify</h1>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentPage("home")}
                className="text-gray-600 hover:text-blue-600"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage("about")}
                className="text-gray-600 hover:text-blue-600"
              >
                About
              </button>
              <button
                onClick={() => setCurrentPage("mission")}
                className="text-gray-600 hover:text-blue-600"
              >
                Mission
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setAuthType("login");
                  }}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setAuthType("signup");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isLoggedIn && currentPage === "home" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Coursify
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform your knowledge into engaging online courses
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthType("signup");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Get Started
              </button>
              <button
                onClick={() => setCurrentPage("about")}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Learn More
              </button>
            </div>
          </div>
        )}

        {!isLoggedIn && currentPage === "about" && (
          <div className="prose max-w-3xl mx-auto">
            <h1>About Coursify</h1>
            <p>
              Coursify is a leading online learning platform that connects
              passionate educators with eager learners. Our mission is to make
              quality education accessible to everyone, everywhere.
            </p>
          </div>
        )}

        {!isLoggedIn && currentPage === "mission" && (
          <div className="prose max-w-3xl mx-auto">
            <h1>Our Mission</h1>
            <p>
              To democratize education by providing a platform where knowledge
              creators can easily build and share their expertise with learners
              worldwide.
            </p>
            <h2>Our Vision</h2>
            <p>
              A world where quality education is accessible to everyone,
              regardless of their location or background.
            </p>
          </div>
        )}

        {!isLoggedIn && currentPage === "privacy" && (
          <div className="prose max-w-3xl mx-auto">
            <h1>Privacy Policy</h1>
            <p>Last updated: January 2024</p>
            <p>
              At Coursify, we take your privacy seriously. This policy describes
              how we collect, use, and protect your personal information.
            </p>
          </div>
        )}

        {!isLoggedIn && currentPage === "terms" && (
          <div className="prose max-w-3xl mx-auto">
            <h1>Terms and Conditions</h1>
            <p>Last updated: January 2024</p>
            <p>
              By using Coursify, you agree to these terms and conditions. Please
              read them carefully before using our platform.
            </p>
          </div>
        )}

        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                {authType === "login" ? "Login" : "Sign Up"}
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />
                <select
                  name="userType"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="">Select User Type</option>
                  <option value="creator">Course Creator</option>
                  <option value="student">Student</option>
                </select>
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setShowAuthModal(false);
                  }}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {authType === "login" ? "Login" : "Sign Up"}
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoggedIn && userType === "student" && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {course.videoCount} videos
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoggedIn && userType === "creator" && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab("library")}
                className={`px-6 py-3 rounded-lg ${
                  activeTab === "library"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <i className="fas fa-video mr-2"></i>
                Video Library
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`px-6 py-3 rounded-lg ${
                  activeTab === "courses"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <i className="fas fa-book mr-2"></i>
                My Courses
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-3 rounded-lg ${
                  activeTab === "create"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <i className="fas fa-plus mr-2"></i>
                Create Course
              </button>
            </div>

            {activeTab === "library" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white p-4 rounded-lg shadow cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, video)}
                  >
                    <div className="aspect-w-16 aspect-h-9 mb-2">
                      <img
                        src={video.thumbnail}
                        alt={`Thumbnail for ${video.title}`}
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "courses" && !editingCourse && (
              <div>
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="title">Sort by Title</option>
                    <option value="videos">Sort by Video Count</option>
                    <option value="level">Sort by Level</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="unpublished">Unpublished</option>
                  </select>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="all">All Categories</option>
                    <option value="development">Development</option>
                    <option value="business">Business</option>
                    <option value="design">Design</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAndSortedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setEditingCourse(course)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">
                          {course.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            course.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {course.videoCount} videos
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePublishCourse(course.id);
                            }}
                            className={`px-4 py-2 rounded ${
                              course.published
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {course.published ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCourse(course);
                            }}
                            className="px-4 py-2 text-blue-600 hover:text-blue-700"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCourses((prev) =>
                                prev.filter((c) => c.id !== course.id)
                              );
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "create" || editingCourse) && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingCourse ? "Edit Course" : "Course Details"}
                    </h2>
                    <input
                      type="text"
                      name="courseTitle"
                      placeholder="Course Title"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="instructor"
                      placeholder="Instructor Name"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      name="description"
                      placeholder="Course Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="4"
                    ></textarea>
                    <select
                      name="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    <select
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="development">Development</option>
                      <option value="business">Business</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Course Content
                    </h2>
                    <div
                      className="border-2 border-dashed p-4 rounded-lg min-h-[200px]"
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                    >
                      <h3 className="text-lg mb-4">Selected Videos</h3>
                      {selectedVideos.map((video, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
                        >
                          <span>{video.title}</span>
                          <button
                            onClick={() =>
                              setSelectedVideos((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-600"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ))}
                      {selectedVideos.length === 0 && (
                        <p className="text-gray-500 text-center">
                          Drag and drop videos here
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleSaveCourse}
                        className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {editingCourse ? "Update Course" : "Save Course"}
                      </button>
                      {editingCourse && (
                        <button
                          onClick={() => {
                            setEditingCourse(null);
                            setCourseTitle("");
                            setInstructor("");
                            setDescription("");
                            setLevel("beginner");
                            setCategory("development");
                            setSelectedVideos([]);
                          }}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Coursify</h3>
              <p className="text-gray-400">
                Transform your knowledge into engaging online courses
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentPage("privacy")}
                  className="block text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setCurrentPage("terms")}
                  className="block text-gray-400 hover:text-white"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">support@coursify.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © 2024 Coursify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainComponent;