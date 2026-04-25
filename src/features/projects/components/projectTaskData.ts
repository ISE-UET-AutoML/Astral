import image_classification from "src/assets/images/image_classification.jpeg";
import text_classification from "src/assets/images/text_classification.jpeg";
import multilabel_text_classification from "src/assets/images/multilabel_text_classification.jpeg";
import tabular_classification from "src/assets/images/tabular_classification.jpeg";
import tabular_regression from "src/assets/images/tabular_regression.jpeg";
import multilabel_tabular_classification from "src/assets/images/multilabel_tabular_classification.jpeg";
import multimodal_classification from "src/assets/images/multimodal_classification.jpeg";
import multilabel_image_classification from "src/assets/images/multilabel_image_classification.jpg";
import object_detection from "src/assets/images/object_detection.jpg";
import semantic_segmentation from "src/assets/images/semantic_segmentation.jpg";
import time_series_forecasting from "src/assets/images/time_series_forecasting.jpg";
import clustering from "src/assets/images/clustering.jpeg";
import audio_classification from "src/assets/images/audio_classification.jpeg";
import video_classification from "src/assets/images/video_classification.jpeg";
import anomaly_detection from "src/assets/images/anomaly_detection.JPG";

export const projType = [
  "image_classification",
  "text_classification",
  "multilabel_text_classification",
  "tabular_classification",
  "tabular_regression",
  "multilabel_tabular_classification",
  "multimodal_classification",
  "object_detection",
  "semantic_segmentation",
  "time_series_forecasting",
  "clustering",
  "audio_classification",
  "video_classification",
  "anomaly_detection",
];

export const taskCards = [
  {
    id: "image_classification",
    title: "Image Classification",
    subtitle: "Recognize what’s in a picture",
    description:
      "Perfect for organizing photo collections, content moderation, and product categorization. Upload images and let AI automatically sort them by content.",
    icon: "📸",
    example_explain: "Classifies an input image into one of several categories.",
    explain: `📌 **This example shows how Image Classification works**.

In this example:

You have a photo of a pet, and you want the system to recognize what animal it is, such as a **dog** or a **cat**

🎯 Possible categories:

**Dog** → the image shows a dog

**Cat** → the image shows a cat`,
    image: image_classification,
    difficulty: "Beginner",
    timeToTrain: "10-30 minutes",
  },
  {
    id: "text_classification",
    title: "Text Classification",
    subtitle: "Assign each piece of text to a specific category",
    description:
      "Analyze customer reviews, emails, or documents to understand sentiment and automatically categorize content for better organization.",
    icon: "📝",
    example_explain: "Predicts sentiment or topic for the given text.",
    explain: `📌 **This example shows how Text Classification works.**

In this example:

You have customer reviews about your products, and you want the system to categorize each review as either **positive** or **negative**

🎯 Possible categories:

**Positive** → the customer is happy or satisfied

**Negative** → the customer is unhappy or disappointed`,
    image: text_classification,
    difficulty: "Beginner",
    timeToTrain: "5-15 minutes",
  },
  {
    id: "multilabel_text_classification",
    title: "Multilabel Text Classification",
    subtitle: "Assign each piece of text to one or more categories",
    description:
      'When text needs multiple tags - like marking an email as both "urgent" and "customer-support" for better organization and routing.',
    icon: "🏷️",
    explain: `📌 **This example shows how Multilabel Text Classification works.**

In this example:

You have short descriptions of movies, and you want the system to identify all the **genres** each movie belongs to.

🎬 For example:

Description #1: “A superhero fights to save the world from a deadly threat.” → The system assigns the genres: **Action, Sci-Fi**

Description #2: “A heartwarming tale of friendship and romance.” → The system assigns the genres: **Romance, Comedy, Drama**


#### 🏷️ Possible Genres (Labels)
**Action**: exciting scenes, battles, or fast-paced events.  
**Sci-Fi**: futuristic or science-based stories.  
**Romance**: love stories or emotional relationships.  
**Comedy**: light-hearted and funny moments.  
**Drama**: serious or emotional storytelling.  `,
    image: multilabel_text_classification,
    difficulty: "Intermediate",
    timeToTrain: "15-25 minutes",
  },
  {
    id: "tabular_classification",
    title: "Tabular Classification",
    subtitle: "Classify structured tabular data rows into predefined categories.",
    description:
      "Perfect for business analytics! Upload spreadsheet data and automatically categorize customers, transactions, or any structured data.",
    icon: "📊",
    example_explain: "Predicts a class for each row in a structured table.",
    explain: `📌 **This example shows how Tabular Classification can classify each customer based on their information**.

In this example:

You have a table of customer information (such as: age, salary, and account balance), and you want the system to predict whether each customer **will churn** (leave your service) or **not churn** (stay).

🎯 For example:

#1 Customer with Age 35, Salary 50K, Balance 75K → The system predicts **Churn**

#2 Customer with Age 42, Salary 62K, Balance 12K → The system preidcts **No Churn**

----- 
**Churn**: the customer is likely to stop using the service  
**No Churn**: the customer is likely to stay
`,
    image: tabular_classification,
    difficulty: "Beginner",
    timeToTrain: "5-20 minutes",
  },
  {
    id: "tabular_regression",
    title: "Tabular Regression",
    subtitle: "Predict a number for each row in a table",
    description:
      "Forecast future values like house prices, sales numbers, or performance scores using your historical data patterns.",
    icon: "📈",
    explain: `📌 **This example shows how Tabular Regression can predict house prices based on simple features.**

You have a table with information about houses (such as: square footage, number of bedrooms, and location), and you want the system to predict **the price of each house**.

🏡 For example:  
House #1: 80 sq ft, 2 bedrooms, Suburban → Predicted price: **1.2M** House #2: 120 sq ft, 3 bedrooms, Suburban → Predicted price: **1.8M** House #3: 100 sq ft, 3 bedrooms, Downtown → Predicted price: **3.0M** House #4: 150 sq ft, 4 bedrooms, Downtown → Predicted price: **4.5M**`,
    image: tabular_regression,
    difficulty: "Intermediate",
    timeToTrain: "10-30 minutes",
  },
  {
    id: "multilabel_tabular_classification",
    title: "Multilabel Tabular Classification",
    subtitle: "Assign each row of a table to one or more categories",
    description:
      "Advanced analysis when data needs multiple classifications - essential for comprehensive customer profiling and risk assessment.",
    icon: "🔍",
    explain: `📌 **This example shows how Multilabel Classification works using movies.** You have a table with information about movies (such as: title and release year), and you want the system to identify all the genres each movie belongs to.  
		🎬 For example:  
		Movie #1: "Avengers: Endgame" — The system assigns: **Action, Adventure, Sci-Fi** Movie #2: "Titanic" — The system assigns: **Romance, Disaster, Historical** Movie #3: "The Hangover" — The system assigns: **Comedy, Adventure**`,
    image: multilabel_tabular_classification,
    difficulty: "Advanced",
    timeToTrain: "20-40 minutes",
  },
  {
    id: "multimodal_classification",
    title: "Multimodal Classification",
    subtitle:
      "Use information from different types of data, like text and images, to assign each item to a specific category.",
    description:
      "The most comprehensive approach! Analyze both visual and textual content together for social media, e-commerce, or content platforms.",
    icon: "🎯",
    example_explain: "Combines image and text signals for classification.",
    explain: `📌 **This example shows how Multimodal Classification classifies customer feedback using multiple input types**.

In this example:

You have customer feedback that can include **text**, **a photo**, or even a **voice recording**, and you want the system to decide whether the feedback is **positive** or **negative**.

For example:  
**#1**: A review with written comments, a happy photo of the product, and a cheerful voice message  
 → The system classifies it as **Positive** **#2**: A review with a complaint in text, a damaged product image, and a frustrated voice recording  
 → The system classifies it as **Negative** -------
**Positive**: the customer is happy and satisfied  
**Negative**: the customer is unhappy and disappointed`,
    image: multimodal_classification,
    difficulty: "Advanced",
    timeToTrain: "25-45 minutes",
  },
  {
    id: "object_detection",
    title: "Object Detection",
    subtitle: "Identify and locate objects within images",
    description:
      "Ideal for surveillance, inventory management, and autonomous vehicles. Detect multiple objects and their positions in a single image.",
    icon: "🎯",
    explain: `📌 **This example shows how Object Detection works.**`,
    image: object_detection,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
  {
    id: "semantic_segmentation",
    title: "Semantic Segmentation",
    subtitle: "Classify each pixel in an image into a category",
    description:
      "Perfect for medical imaging, autonomous driving, and image editing. Understand the context of each pixel for detailed analysis.",
    icon: "🖼️",
    explain: `📌 **This example shows how Semantic Segmentation works.**`,
    image: semantic_segmentation,
    difficulty: "Advanced",
    timeToTrain: "40-70 minutes",
  },
  {
    id: "time_series_forecasting",
    title: "Time Series Forecasting",
    subtitle: "Predict future values based on historical time-stamped data",
    description:
      "Essential for sales forecasting, stock price prediction, and resource planning. Analyze trends and seasonal patterns to make informed decisions.",
    icon: "⏳",
    explain: `📌 **This example shows how Time Series Forecasting works.**`,
    image: time_series_forecasting,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
  {
    id: "clustering",
    title: "Clustering",
    subtitle: "Predict future values based on historical time-stamped data",
    description:
      "Essential for sales forecasting, stock price prediction, and resource planning. Analyze trends and seasonal patterns to make informed decisions.",
    icon: "🧩",
    explain: `📌 **This example shows how Clustering works.**`,
    image: clustering,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
  {
    id: "audio_classification",
    title: "Audio Classification",
    subtitle: "Classify audio clips into predefined categories",
    description:
      "Ideal for speech recognition, music genre classification, and environmental sound detection. Analyze audio data to extract meaningful insights.",
    icon: "🎵",
    explain: `📌 **This example shows how Audio Classification works.**`,
    image: audio_classification,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
  {
    id: "video_classification",
    title: "Video Classification",
    subtitle: "Classify videos into predefined categories",
    description:
      "Perfect for content moderation, action recognition, and video recommendation systems. Analyze video data to categorize content effectively.",
    icon: "🎬",
    explain: `📌 **This example shows how Video Classification works.**`,
    image: video_classification,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
  {
    id: "anomaly_detection",
    title: "Anomaly Detection",
    subtitle: "Identify unusual patterns in data",
    description:
      "Ideal for fraud detection, network security, and fault detection. Analyze data streams to detect anomalies in real-time.",
    icon: "🔍",
    explain: `📌 **This example shows how Anomaly Detection works.**`,
    image: anomaly_detection,
    difficulty: "Advanced",
    timeToTrain: "30-60 minutes",
  },
];
