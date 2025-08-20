/**
 * 路由预加载工具
 * 用于在后台预加载所有路由组件，提升用户体验
 */

export interface PreloadResult {
    success: number;
    failed: number;
    total: number;
}

export class RoutePreloader {
    private static isPreloading = false;
    private static isPreloaded = false;

    /**
     * 预加载所有路由组件
     * @param delay 延迟时间（毫秒）
     * @returns Promise<PreloadResult>
     */
    static async preloadAll(delay: number = 0): Promise<PreloadResult> {
        if (this.isPreloading || this.isPreloaded) {
            console.log('路由组件已在预加载中或已预加载完成');
            return { success: 0, failed: 0, total: 0 };
        }

        this.isPreloading = true;

        // 如果有延迟，等待指定时间
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.log('开始预加载路由组件...');

        const preloadPromises = [
            import('@pages/home.vue'),
            import('@pages/login.vue'),
            import('@pages/register.vue'),
            import('@pages/file.vue'),
            import('@pages/generateCode.vue'),
            import('@pages/feedback.vue'),
            import('@pages/appreciate.vue'),
            import('@pages/unreadMsg.vue'),
            import('@pages/readMsg.vue'),
            import('@pages/projects.vue'),
            import('@pages/chat.vue'),
            import('@pages/profile.vue')
        ];

        try {
            const results = await Promise.allSettled(preloadPromises);
            const successCount = results.filter(result => result.status === 'fulfilled').length;
            const failureCount = results.filter(result => result.status === 'rejected').length;

            this.isPreloaded = true;
            this.isPreloading = false;

            const result: PreloadResult = {
                success: successCount,
                failed: failureCount,
                total: preloadPromises.length
            };

            console.log(`路由组件预加载完成: ${successCount}/${preloadPromises.length} 个成功`);
            
            if (failureCount > 0) {
                console.warn(`${failureCount} 个组件预加载失败`);
                // 输出失败的组件信息
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.warn(`组件 ${index} 预加载失败:`, result.reason);
                    }
                });
            }

            return result;
        } catch (error) {
            this.isPreloading = false;
            console.error('路由组件预加载过程中出现错误:', error);
            throw error;
        }
    }

    /**
     * 检查是否已经预加载完成
     */
    static isPreloadComplete(): boolean {
        return this.isPreloaded;
    }

    /**
     * 检查是否正在预加载
     */
    static isCurrentlyPreloading(): boolean {
        return this.isPreloading;
    }

    /**
     * 重置预加载状态（用于开发调试）
     */
    static reset(): void {
        this.isPreloading = false;
        this.isPreloaded = false;
    }
}

export default RoutePreloader;
