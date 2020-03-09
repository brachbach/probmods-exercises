// To run, paste into http://webppl.org/

// Will early 2020 AI solve at least 20% of previously unseen IQ-test like tasks?
// see https://docs.google.com/document/d/10oojvXaYnYZ8n4NIJ62hEfPjx5jpxNnCb53c63T_IFE/edit#heading=h.t4a2sqh0ni1u

/*
# Understanding the question:
- The ARC (https://github.com/fchollet/ARC) is an ML benchmark that
    - according the question, is supposed to measure:
        - "cognitive abilities that could broadly generalize to many tasks remain elusive"
        - "the general, broad intelligence of machines"
        - "the variability and unpredictability of the real world"
        - and is "similar to the Raven's Progressive Matrices IQ test"
    - is described in detail here: https://arxiv.org/abs/1911.01547
    - training examples: https://www.kaggle.com/lopuhin/check-all-train-and-test-examples
- the creator of the benchmark started a Kaggle competition for performance on the benchmark
    - here: https://www.kaggle.com/c/abstraction-and-reasoning-challenge/overview/description
- the question asks: will there be a submission to the Kaggle competition that will
"pass 0.8 or less top-3 error rate as defined in the Kaggle competition evaluation?"
    - not super clear, so followed the link (https://www.kaggle.com/c/abstraction-and-reasoning-challenge/overview/evaluation)
        - my interpretation: you get three guesses for answers to each question.
            - if any guess is exactly right, your error is 0
            - if no guess is exactly right, your error is 1
- 362 people have submitted solutions so far (https://www.kaggle.com/c/abstraction-and-reasoning-challenge/leaderboard)
    - of which only 23 have gotten any questions right
    - best performance so far is 97% error rate
- Restating the question, compactly, in terms that I personally understand well:
    - "There's a public Kaggle competition on the ARC with a $20,000 prize.
    Each model gets to submit 3 answers to each question,
    and you get the question right if at least one answer is exactly right.
    Will there be at least one team that gets at least 20% of the questions right?"
## Less important to find out
- how long did teams have to work on models?

# Reasoning about how to answer the question:
## Inside information
- people working on competition submissions/other insiders potentially have varying degress of inside information about it:
    - they may have good reason to be very confident that someone (maybe themselves) will beat 20%
    - they may have good reason to be pretty skeptical that anyone will beat 20%,
    if they know that they and other top teams have tried really hard and haven't gotten close
## Reasoning about the question
- why not predict the performace of the top model, rather than asking whether any model will beat 20%?
    - I'd guess the reasons are uninteresting, something like "because the question-asker prefers binary questions"
*/

// Prediction 1: snap judgement: 40%
// 80% CI of my credence after 5 hours of research: 25% to 90%
// I guess technically a snap judgement prediction isn't allowed :(
