const axios = require('axios');

async function testAPIs() {
  console.log("=== Testing Authentication ===");
  const testUser = {
    name: "Test User",
    email: "test_user_react_app_xyz_123456@example.com",
    password: "Password123!",
    gender: "male",
    dateOfBirth: "1990-01-01"
  };

  let token = null;

  try {
    const signupRes = await axios.post("https://route-posts.routemisr.com/users/signup", testUser);
    console.log("Signup success:", signupRes.status);
  } catch (err) {
    console.log("Signup failed (might already exist):", err.response?.data?.error || err.message);
  }

  try {
    const signinRes = await axios.post("https://route-posts.routemisr.com/users/signin", {
      email: testUser.email,
      password: testUser.password
    });
    console.log("Signin success:", signinRes.status);
    token = signinRes.data?.token;
  } catch (err) {
    console.log("Signin failed:", err.response?.data?.error || err.message);
    return;
  }

  console.log("Token obtained:", token ? "Yes" : "No");

  console.log("\n=== Testing GET Posts ===");
  let postId = null;
  try {
    const getPostsRes = await axios.get("https://route-posts.routemisr.com/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Get Posts success:", getPostsRes.status);
    if (getPostsRes.data.data?.posts?.length > 0) {
      postId = getPostsRes.data.data.posts[0]._id;
      console.log("Using Post ID for comment test:", postId);
    }
  } catch (err) {
    console.log("Get Posts failed:", err.response?.data?.error || err.message);
    return;
  }

  console.log("\n=== Testing POST /comments (Current implementation: linked-posts, token) ===");
  try {
    const commentBody = {
      content: "Test comment from script",
      post: postId,
    };
    const commentRes = await axios.post("https://linked-posts.routemisr.com/comments", commentBody, {
      headers: { token: token }
    });
    console.log("SUCCESS:", commentRes.status);
  } catch (err) {
    console.log("FAILED:", err.response?.data || err.message);
  }

  console.log("\n=== Testing POST /comments (route-posts, token) ===");
  try {
    const commentBody = {
      content: "Test comment from script",
      post: postId,
    };
    const commentRes2 = await axios.post("https://route-posts.routemisr.com/comments", commentBody, {
      headers: { token: token }
    });
    console.log("SUCCESS:", commentRes2.status);
  } catch (err) {
    console.log("FAILED:", err.response?.data || err.message);
  }

  console.log("\n=== Testing POST /comments (route-posts, Bearer token) ===");
  try {
    const commentBody = {
      content: "Test comment from script",
      post: postId,
    };
    const commentRes3 = await axios.post("https://route-posts.routemisr.com/comments", commentBody, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("SUCCESS:", commentRes3.status);
  } catch (err) {
    console.log("FAILED:", err.response?.data || err.message);
  }
}

testAPIs();
