# Code for the analysis of SARA data

## Author: Tianchen Qian

See SARA_analysis_documentation.pdf for details.

## FAQ: how to do estimation that excludes certain observations?

**Q:** "A sensitivity analysis to be performed is to remove participant days that have missing intervention assignment. For example, if participant 1 has missing intervention assignment on days 2, 5, 19, and 23, then we do not use these days to estimate the treatment effect or to estimate standard errors, but other days belonging to participant 1 are still used. Can I use the existing code for this, or would it be necessary for you to make modifications to the code?"

**A:** One would do the following:
(1) Construct all the covariates to be used in the analysis (including those lagged covariates/outcomes), using the entire data set.
(2) Remove the rows where treatment assignment = NA from the data set. The data set is supposed to be in long format, so only those dates with treatment assignment = NA will be removed.
(3) Pass the data set into the function to do estimation.

Alternatively, instead of (2) one can do (2') set availability = 0 for those rows where treatment assignment = NA.

This way can also be used to do sensitivity analysis where an arbitrary set of observations are removed. The key is to pre-compute the covariates (make columns) before removing any rows, so that all lagged covariates are correctly computed.
