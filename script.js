// Listen for form submission
document.getElementById('wellbeingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Retrieve user inputs
    const sleep = parseFloat(document.getElementById('sleep').value);
    const exercise = parseFloat(document.getElementById('exercise').value);
    const stress = parseFloat(document.getElementById('stress').value);
    
    // Calculate individual scores:
    // Ideal sleep is 9 hours; more sleep is capped at 100%
    let sleepScore = Math.min((sleep / 9) * 100, 100);
    
    // Ideal is 5 sessions per week for exercise; more sessions cap at 100%
    let exerciseScore = Math.min((exercise / 5) * 100, 100);
    
    // Lower work stress is better. Convert stress rating (1-10) so that 1 gives 100% and 10 gives 0%.
    let stressScore = Math.min(((10 - stress) / 10) * 100, 100);
    
    // Compute the average well-being rating (higher is better)
    let avgScore = (sleepScore + exerciseScore + stressScore) / 3;
    let wellbeingRating = Math.round(avgScore);
    
    // Display the score in the result section
    document.getElementById('scoreDisplay').textContent = wellbeingRating + "%";
    
    // Also show the score immediately in an alert pop-up
    alert("Your well-being score is: " + wellbeingRating + "%");
    
    // Set the progress bar's final width using the computed rating
    document.getElementById('progressBar').style.setProperty('--score-percentage', wellbeingRating + '%');
    
    // Fetch recommendation data from JSON file
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      
      // Filter recommendations based on the user's well-being score
      let recs = data.recommendations.filter(rec => wellbeingRating < rec.minRating);
      
      // Sort recommendations (those with higher thresholds appear first)
      recs.sort((a, b) => b.minRating - a.minRating);
      
      // Populate the recommendations list
      const recList = document.getElementById('recommendations');
      recList.innerHTML = '';
      if (recs.length === 0) {
        recList.innerHTML = '<li>Your well-being is excellent! Keep up the great work!</li>';
      } else {
        recs.forEach(rec => {
          const li = document.createElement('li');
          li.textContent = rec.tip;
          recList.appendChild(li);
        });
      }
      
      // Show the result panel
      document.getElementById('result').classList.remove('hidden');
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  });
  