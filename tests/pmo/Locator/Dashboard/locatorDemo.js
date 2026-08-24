const locatorDemo = {
    // Navigation Selectors
    computeMenuRole: 'button',
    computeMenuName: 'Compute',
    VMMenuRole: 'link',
    VMMenuName: 'VMs',
    createVMButtonTestId: 'button-create-options',

    // Distributions Modal Selectors
    seeAllDisributionButtonRole: 'button',
    seeAllDisributionButtonName: 'See all',
    distributionsModalRole: 'dialog',
    ubuntuRowText: /Ubuntu/i,
    chooseButtonRole: 'button',
    chooseButtonName: 'Choose',

    // Plan Modal Selectors
    choosePlanButtonRole: 'button',
    choosePlanButtonName: 'Choose a plan',
    planModalRole: 'dialog',
    planSaRowText: /s-a/i,
    confirmPlanButtonRole: 'button',
    confirmPlanButtonName: 'Choose',

    // VM Detail & Auth Selectors
    authUsernameRole: 'textbox',
    authUsernameName: 'Username',
    passwordTabButtonText: 'Password',
    authPasswordRole: 'textbox',
    authPasswordName: 'Password',
    hostnameInput: 'div',
    nameInput: 'div',

    // Submit Button
    submitButtonTestId: 'submit-button',
};

export default locatorDemo;