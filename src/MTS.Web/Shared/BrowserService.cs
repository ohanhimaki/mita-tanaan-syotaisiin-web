using Microsoft.JSInterop;

namespace MTS.Web.Shared;

public static class BrowserService
{
    public static async Task<int> GetInnerWidth(IJSRuntime _JS)
    {
        return await _JS.InvokeAsync<int>("browser.getInnerWidth");
    }
}
